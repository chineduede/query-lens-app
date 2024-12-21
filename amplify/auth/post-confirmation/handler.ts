import { randomUUID } from 'crypto';
import { PostConfirmationTriggerHandler } from 'aws-lambda';

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const email = event.request.userAttributes['email'];
  const tenantId = randomUUID();
  const domain = email.split('@')[1];

  // add tenantId and companyName to user attributes
  event.request.userAttributes['custom:tenantId'] = tenantId;
  event.request.userAttributes['custom:companyName'] = domain;

  // create a new tenant
  console.log('Creating a new tenant', JSON.stringify(event.request.userAttributes));

  return event;
};
