import { User } from "@prisma/client";

declare global{
  namespace Express{
    interface Request{
      user: User;
      /*
        other variables (if needed)
      */
    }
  }
}
 