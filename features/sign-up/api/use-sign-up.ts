// hooks/useSignUp.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { client } from '@/lib/hono';
import { InferRequestType, InferResponseType } from 'hono';

// Define the response and request types for your API
type ResponseType = InferResponseType<typeof client.api.signup.$post>;
type RequestType = InferRequestType<typeof client.api.signup.$post>['json'];

export const useSigningUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data: RequestType) => {
      try {
        console.log("Trying signup mutation")
        const response = await client.api.signup.$post({ json: data });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }

        return await response.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('User created successfully!');
    },
    onError: () => {
      toast.error('Failed to create user');
      console.error("The error here is", error)
    },
  });

  return mutation;
};
