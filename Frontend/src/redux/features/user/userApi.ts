import { baseApi } from '../../api/baseApi';
import type { IUser } from '../../../types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: (searchTerm) => ({
        url: '/user/search',
        params: { searchTerm },
      }),
      providesTags: ['User'],
    }),
    getDeliveryBoys: builder.query({
      query: () => '/user/all-users',
      transformResponse: (response: { data: IUser[] }) => {
        return response.data.filter((user: IUser) => user.role === 'DELIVERY_BOY');
      },
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateLiveLocation: builder.mutation({
      query: (location) => ({
        url: '/user/live-location/update',
        method: 'PATCH',
        body: location,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
    useSearchUsersQuery, 
    useLazySearchUsersQuery, 
    useGetDeliveryBoysQuery, 
    useUpdateLiveLocationMutation, 
    useUpdateUserMutation 
} = userApi;
