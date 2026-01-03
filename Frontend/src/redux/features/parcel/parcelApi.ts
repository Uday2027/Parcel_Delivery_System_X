import { baseApi } from '../../api/baseApi';

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createParcel: builder.mutation({
      query: (data) => ({
        url: '/parcel/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Parcel'],
    }),
    getMyParcels: builder.query({
      query: () => '/parcel/my',
      providesTags: ['Parcel'],
    }),
    getAllParcels: builder.query({
      query: () => '/parcel/all-parcel',
      providesTags: ['Parcel'],
    }),
    assignDeliveryBoy: builder.mutation({
      query: (data) => ({
        url: '/parcel/assign-delivery-boy',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Parcel'],
    }),
    getAssignedParcels: builder.query({
      query: () => '/parcel/assigned-parcels',
      providesTags: ['Parcel'],
    }),
    updateParcelStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/parcel/status/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Parcel'],
    }),
    cancelParcel: builder.mutation({
      query: (id) => ({
        url: `/parcel/cancel/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Parcel'],
    }),
    getParcelByTrackingId: builder.query({
      query: (trackingId) => `/parcel/tracking/${trackingId}`,
      providesTags: ['Parcel'],
    }),
  }),
});

export const {
  useCreateParcelMutation,
  useGetMyParcelsQuery,
  useGetAllParcelsQuery,
  useAssignDeliveryBoyMutation,
  useGetAssignedParcelsQuery,
  useUpdateParcelStatusMutation,
  useCancelParcelMutation,
  useGetParcelByTrackingIdQuery,
  useLazyGetParcelByTrackingIdQuery,
} = parcelApi;
