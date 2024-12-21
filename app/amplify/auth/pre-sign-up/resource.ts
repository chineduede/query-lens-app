import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  resourceGroupName: 'auth',
  runtime: 20,
});
