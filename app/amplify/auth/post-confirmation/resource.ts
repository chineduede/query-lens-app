import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  resourceGroupName: 'auth',
  runtime: 20,
});
