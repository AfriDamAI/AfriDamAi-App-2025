import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import { Cart, CartItem } from '@/lib/types';

// Restores cart items from sessionStorage when the backend has cleared the cart
// after order creation but before payment is confirmed.
function withPendingSnapshot(cart: Cart): Cart {
  if (typeof window === 'undefined' || cart.items?.length > 0) return cart;
  const pendingOrderId = sessionStorage.getItem('pending_order_id');
  if (!pendingOrderId) return cart;
  try {
    const raw = sessionStorage.getItem('pending_cart_snapshot');
    if (!raw) return cart;
    return { ...cart, items: JSON.parse(raw) };
  } catch {
    return cart;
  }
}

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
    const currentCart = useCart.getState().cart;
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<Cart>(`/cart/${userId}`);
      if (response.data) {
        set({ cart: withPendingSnapshot(response.data), loading: false });
      } else {
        const createResponse = await apiClient.post<Cart>('/cart', { userId });
        set({ cart: withPendingSnapshot(createResponse.data), loading: false });
      }
    } catch (error: any) {
      console.error("🛒 FETCH CART ERROR:", error);
      if (error.response?.status === 404) {
        // Cart was deleted on the backend — recreate unconditionally.
        // A local cart with a stale ID would cause all writes to fail.
        try {
          const createResponse = await apiClient.post<Cart>('/cart', { userId });
          set({ cart: withPendingSnapshot(createResponse.data), loading: false });
        } catch (createError) {
          set({ error: 'Failed to create cart', loading: false });
        }
      } else {
        // Transient network error — preserve an existing cart silently,
        // show an error only if there's nothing to fall back to.
        set({ error: currentCart ? null : 'Failed to fetch cart', loading: false });
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

      // FORCE strict formatting structures to satisfy the new backend guard requirements
      const payload = { 
        productId: item.productId,
        productName: item.productName || "Care Product",
        productImage: item.productImage || "",
        cartId: currentCart.id,
        price: Number(item.price || 0),
        quantity: Math.max(1, Number(item.quantity || 1))
      };
      await apiClient.post(`/cart/addItem/${userId}`, payload);

      // Optimistic update so the UI reflects the change immediately.
      set((state) => {
        const cart = state.cart!;
        const existingItemIndex = cart.items.findIndex((i) => i.productId === item.productId);

        let newItems;
        if (existingItemIndex > -1) {
          newItems = [...cart.items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: Number(newItems[existingItemIndex].quantity) + Number(item.quantity),
            price: Number(newItems[existingItemIndex].price || item.price)
          };
        } else {
          newItems = [...cart.items, {
            productId: item.productId,
            productName: item.productName || "Care Product",
            productImage: item.productImage || "",
            cartId: cart.id,
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1)
          }];
        }
        return {
          cart: { ...cart, items: newItems }
        };
      });

      // Sync server state to pick up the server-assigned item id.
      await useCart.getState().fetchCart(userId);
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

      set((state) => {
        if (!state.cart) return state;
        const newItems = state.cart.items.map(item => 
          item.productId === productId ? { ...item, quantity: Number(quantity) } : item
        );
        return { cart: { ...state.cart, items: newItems } };
      });

      const payload = {
        cartId: cart.id,
        productId: productId,
        quantity: Number(quantity),
      };

      await apiClient.put(`/cart/${userId}`, payload);
      
    } catch (error: any) {
      console.error('🛒 UPDATE QUANTITY TOTAL FAILURE:', error.response?.data || error.message);
      await useCart.getState().fetchCart(userId);
    }
  },
  removeFromCart: async (userId, productId) => {
    try {
      try {
        await apiClient.delete(`/cart/${userId}/items/${productId}`);
      } catch (delError) {
        const cart = useCart.getState().cart;
        const item = cart?.items.find(i => i.productId === productId);
        if (item?.id) {
          await apiClient.delete(`/cart/${userId}/items/${item.id}`);
        } else {
          throw delError;
        }
      }
      set((state) => {
        if (!state.cart) return state;
        return {
          cart: {
            ...state.cart,
            items: state.cart.items.filter((i) => i.productId !== productId),
          },
        };
      });
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  },
  clearCart: async (userId) => {
    try {
      await apiClient.delete(`/cart/${userId}/clear`);
      set((state) => {
        if (!state.cart) return state;
        return {
          cart: {
            ...state.cart,
            items: [],
          },
        };
      });
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  },
}));
