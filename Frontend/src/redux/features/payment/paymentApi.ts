import { baseApi } from '../../api/baseApi';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/payment/create-intent',
        method: 'POST',
        body: data,
      }),
    }),
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: '/payment/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Parcel'],
    }),
  }),
});

export const { useCreatePaymentIntentMutation, useConfirmPaymentMutation } = paymentApi;
