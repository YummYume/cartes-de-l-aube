import { z } from 'zod';

export const moneyValidation = z.object({
  count: z
    .number({
      required_error: 'You need to specify how much orundum you want...',
      invalid_type_error: 'This number is looking pretty sus...',
    })
    .positive('Do you really want to LOSE orundum?')
    .lte(1000000, "Hey, 1000000 is pretty good already, isn't it?"),
});
