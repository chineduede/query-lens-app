import { defineAuth } from '@aws-amplify/backend';
import { preSignUp } from './pre-sign-up/resource';
import { postConfirmation } from './post-confirmation/resource';
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    preSignUp,
    postConfirmation,
  },
  userAttributes: {
    'custom:tenantId': {
      dataType: 'String',
      // mutable: true,
    },
    'custom:companyName': {
      dataType: 'String',
      // mutable: true,
    },
  },
});

