import {get} from "./data/trips.js"
import { getUserById } from "./data/users.js";
export async function checkUserAllowed(req, res, next) {
    if (req.session.user) {
      let user = await getUserById(req.session.user.id);
      let trip = await get(req.params.tripName);
      if (trip.users_allowed.includes(user.email)) {
        next();
      } else {
        res.status(403).send("Access denied");
      }
    } else {
        return res.redirect('/login')
    }
  }