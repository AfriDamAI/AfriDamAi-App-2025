import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import { Cart, CartItem } from '@/lib/types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, item: CartItem) => Promise<void>;
  updateQuantity: (userId: string, productId: string, quantity: number) => Promise<void>;
  removeFromCart: (userId: string, productId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
}

export const useCart = create<CartState>((set) => ({
  cart: null,
  loading: false,
  error: null,
  fetchCart: async (userId) => {
    set({ loading: true, error: null });
    try {
      // 🛡️ SYNERGY DIAGNOSTIC: Using capitalized "Cart" as per Swagger
      const response = await apiClient.get<Cart>(`/Cart/${userId}`);
      
      if (response.data) {
        set({ cart: response.data, loading: false });
      } else {
        const createResponse = await apiClient.post<Cart>('/Cart', { userId });
        set({ cart: createResponse.data, loading: false });
      }
    } catch (error: any) {
      console.error("🛒 FETCH CART ERROR:", error);
      if (error.response?.status === 404) {
        try {
          const createResponse = await apiClient.post<Cart>('/Cart', { userId });
          set({ cart: createResponse.data, loading: false });
        } catch (createError) {
          set({ error: 'Failed to create cart', loading: false });
        }
      } else {
        set({ error: 'Failed to fetch cart', loading: false });
      }
    }
  },
  addToCart: async (userId, item) => {
    try {
      let currentCart = useCart.getState().cart;
      
      if (!currentCart) {
        await useCart.getState().fetchCart(userId);
        currentCart = useCart.getState().cart;
      }

      if (!currentCart) throw new Error("No cart available");

      const payload = { 
        ...item, 
        cartId: currentCart.id,
        // Ensure name and image are passed if they exist
        productName: item.productName,
        productImage: item.productImage
      };
      await apiClient.post(`/Cart/addItem/${userId}`, payload);
      
      set((state) => {
        const cart = state.cart!;
        const existingItemIndex = cart.items.findIndex((i) => i.productId === item.productId);
        
        let newItems;
        if (existingItemIndex > -1) {
          newItems = [...cart.items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + item.quantity
          };
        } else {
          newItems = [...cart.items, { ...item, cartId: cart.id }];
        }

        return {
          cart: { ...cart, items: newItems }
        };
      });
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  },
  updateQuantity: async (userId, productId, quantity) => {
    if (quantity < 1) {
      await useCart.getState().removeFromCart(userId, productId);
      return;
    }
    
    try {
      const state = useCart.getState();
      const cart = state.cart;
      if (!cart) return;

      // Optimistic update
      set((state) => {
        if (!state.cart) return state;
        const newItems = state.cart.items.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        );
        return { cart: { ...state.cart, items: newItems } };
      });

      // Construct the updated cart object
      const updatedItems = cart.items.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );

      const payload = {
        cartId: cart.id,
        userId: cart.userId, // Ensure userId is sent with cart update
        items: updatedItems,
      };

      // Use PUT to update the entire cart
      await apiClient.put(`/Cart/${cart.id}`, payload);
      
    } catch (error: any) {
      console.error('🛒 UPDATE QUANTITY TOTAL FAILURE:', error.response?.data || error.message);
      // Re-fetch to sync with backend on failure
      await useCart.getState().fetchCart(userId);
    }
  },
  removeFromCart: async (userId, productId) => {
    try {
      
      try {
        await apiClient.delete(`/Cart/${userId}/items/${productId}`);
      } catch (delError) {
        // Fallback to internal ID
        const cart = useCart.getState().cart;
        const item = cart?.items.find(i => i.productId === productId);
        if (item?.id) {
          await apiClient.delete(`/Cart/${userId}/items/${item.id}`);
        } else {
          throw delError;
        }
      }
      set((state) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter((i) => i.productId !== productId);
        }
        return { cart: state.cart };
      });
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  },
  clearCart: async (userId) => {
    try {
      await apiClient.delete(`/Cart/${userId}/clear`);
      set((state) => {
        if (state.cart) {
          state.cart.items = [];
        }
        return { cart: state.cart };
      });
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  },
}));
