import { randomUUID } from 'crypto';
import { PreSignUpTriggerHandler } from 'aws-lambda';
import { FREE_EMAIL_DOMAINS } from './domains';

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes['email'];
  const tenantId = randomUUID();
  const domain = email.split('@')[1];

  // add tenantId and companyName to user attributes
  event.request.userAttributes['custom:tenantId'] = tenantId;
  event.request.userAttributes['custom:companyName'] = domain;
  // We can be sure it is a valid email because validation is done by AWS
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    throw new Error('Must use a company email.');
  }
  return event;
};
