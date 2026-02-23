(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/AfriDamAi-App-2025/providers/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider({ children }) {
    _s();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("light");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const savedTheme = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
            setTheme(initialTheme);
            document.documentElement.classList.toggle("dark", initialTheme === "dark");
            setMounted(true);
        }
    }["ThemeProvider.useEffect"], [
        theme
    ]);
    const toggleTheme = ()=>{
        setTheme((prev)=>{
            const newTheme = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            document.documentElement.classList.toggle("dark", newTheme === "dark");
            return newTheme;
        });
    };
    // if (!mounted) {
    //   return <ThemeContext.Provider value={{ theme: "light", toggleTheme }}>{children}</ThemeContext.Provider>
    // }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            toggleTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/AfriDamAi-App-2025/providers/theme-provider.tsx",
        lineNumber: 42,
        columnNumber: 10
    }, this);
}
_s(ThemeProvider, "yJRom449FMCLHbV8U85fR4UAvks=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AfriDamAi-App-2025/lib/environment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "environment",
    ()=>environment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const environment = {
    apiUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    backendUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
    production: ("TURBOPACK compile-time value", "development") === "production"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AfriDamAi-App-2025/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeIngredients",
    ()=>analyzeIngredients,
    "analyzeSkinImage",
    ()=>analyzeSkinImage,
    "getProfile",
    ()=>getProfile,
    "getUser",
    ()=>getUser,
    "login",
    ()=>login,
    "register",
    ()=>register,
    "setAuthToken",
    ()=>setAuthToken,
    "updateProfile",
    ()=>updateProfile,
    "updateUser",
    ()=>updateUser,
    "uploadImage",
    ()=>uploadImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$environment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AfriDamAi-App-2025/lib/environment.ts [app-client] (ecmascript)");
;
;
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$environment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["environment"].backendUrl
});
const setAuthToken = (token)=>{
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common["Authorization"];
    }
};
const login = async (credentials)=>{
    const response = await apiClient.post("/api/auth/user/login", credentials);
    return response.data;
};
const register = async (userData)=>{
    const response = await apiClient.post("/api/auth/user/register", userData);
    return response.data;
};
const getProfile = async ()=>{
    const response = await apiClient.get("/api/profile");
    return response.data;
};
const getUser = async (id)=>{
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
};
const updateProfile = async (updates)=>{
    const response = await apiClient.patch("/api/profile", updates);
    return response.data;
};
const updateUser = async (id, updates)=>{
    const response = await apiClient.patch(`/api/users/${id}`, updates);
    return response.data;
};
async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
    });
    if (!response.ok) {
        throw new Error("Upload failed");
    }
    return response.json();
}
async function analyzeSkinImage(imageId, imageData) {
    const response = await fetch("/api/analyze-skin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            imageId,
            imageData
        })
    });
    if (!response.ok) {
        throw new Error("Analysis failed");
    }
    return response.json();
}
async function analyzeIngredients(ingredients) {
    const response = await fetch("/api/analyze-ingredients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ingredients
        })
    });
    if (!response.ok) {
        throw new Error("Analysis failed");
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/AfriDamAi-App-2025/providers/auth-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jwt-decode/build/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/AfriDamAi-App-2025/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const token = localStorage.getItem("token");
            if (token) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthToken"])(token);
                try {
                    const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jwtDecode"])(token);
                    const userId = decoded.sub || decoded.id;
                    if (userId) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUser"])(userId).then({
                            "AuthProvider.useEffect": (response)=>{
                                const userData = response.resultData || response;
                                setUser(userData);
                            }
                        }["AuthProvider.useEffect"]).catch({
                            "AuthProvider.useEffect": (err)=>{
                                console.error("User fetch error:", err);
                                signOut();
                            }
                        }["AuthProvider.useEffect"]);
                    }
                } catch (err) {
                    console.error("Token decode error:", err);
                    signOut();
                }
            }
        }
    }["AuthProvider.useEffect"], []);
    const signIn = async (credentials)=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])(credentials);
            const { accessToken } = data;
            localStorage.setItem("token", accessToken);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthToken"])(accessToken);
            const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jwtDecode"])(accessToken);
            const userId = decoded.sub || decoded.id;
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUser"])(userId);
            setUser(response.resultData || response);
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    };
    const signUp = async (userData)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])(userData);
            // Automatically sign in the user directly after registration
            await signIn({
                email: userData.email,
                password: userData.password
            });
        } catch (error) {
            console.error("Sign up error:", error);
            throw error;
        }
    };
    const signOut = ()=>{
        setUser(null);
        localStorage.removeItem("token");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthToken"])(null);
    };
    const updateUserProfile = async (updates)=>{
        if (user && user.id) {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$AfriDamAi$2d$App$2d$2025$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateUser"])(user.id, updates);
            setUser(response.resultData || response);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isSignedIn: !!user,
            signIn,
            signUp,
            signOut,
            updateUserProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/AfriDamAi-App-2025/providers/auth-provider.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "5s2qRsV95gTJBmaaTh11GoxYeGE=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=AfriDamAi-App-2025_676f3033._.js.map