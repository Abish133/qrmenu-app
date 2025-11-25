import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      restaurant: null,
      token: null,
      isAuthenticated: false,

      login: (userData) => {
        const { token, user, restaurant } = userData;
        localStorage.setItem('token', token);
        set({
          user,
          restaurant,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          restaurant: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      updateRestaurant: (restaurantData) => {
        set((state) => ({
          restaurant: { ...state.restaurant, ...restaurantData },
        }));
      },

      setProfile: (profileData) => {
        const { user, restaurant } = profileData;
        set({ user, restaurant });
      },

      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        restaurant: state.restaurant,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;