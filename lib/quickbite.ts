import type { IconName } from "./icons";

/** Single persona used across every CRUD scenario so it feels like one story. */
export const PERSONA = {
  name: "Rahul Sharma",
  location: "Koramangala, Bangalore",
  phone: "+91 98XXX XX210",
  initials: "RS",
};

export const APP_NAME = "QuickBite";

export type CrudOp = "GET" | "POST" | "PUT" | "DELETE";
export type CrudVerb = "Read" | "Create" | "Update" | "Delete";

export interface CrudStep {
  op: CrudOp;
  crud: CrudVerb;
  /** Short label for the operation selector button. */
  tab: string;
  icon: IconName;
  /** Plain-language business situation. */
  scenario: string;
  /** "What the user sees" — the visible app behaviour. */
  userSees: string;
  /** "What happens behind the scenes" — backend/database. */
  behindScenes: string;
  /** "How the API helps" — why the API call matters. */
  apiHelps: string;
  /** PM learning insight (business framing). */
  insight: string;
  method: CrudOp;
  endpoint: string;
  requestBody?: Record<string, unknown>;
}

export const CRUD_STEPS: CrudStep[] = [
  {
    op: "GET",
    crud: "Read",
    tab: "Track order",
    icon: "eye",
    scenario:
      "Rahul opens the QuickBite app to check where his dinner is.",
    userSees:
      "The order screen loads with the live status, the delivery ETA, and the driver's name.",
    behindScenes:
      "The app asks the backend: “give me everything about order ORD-4815.” The backend reads that one row from the orders database and sends it back.",
    apiHelps:
      "A GET request fetches existing data without changing anything. It's the most-called API in almost every product.",
    insight:
      "If this API is slow, users repeatedly refresh the app and customer anxiety increases — a slow GET feels like the app is broken.",
    method: "GET",
    endpoint: "/orders/ORD-4815",
  },
  {
    op: "POST",
    crud: "Create",
    tab: "Place order",
    icon: "plus",
    scenario:
      "It's 8 PM. Rahul adds a burger combo to his cart and taps “Place Order”.",
    userSees:
      "Cart is confirmed → payment is processed → a fresh order appears with status “Preparing”.",
    behindScenes:
      "The app sends the new order to the backend. A brand-new row is created in the orders database and the total order count goes up by one.",
    apiHelps:
      "A POST request creates something that didn't exist before. This is the moment a sale actually happens.",
    insight:
      "If the POST API fails during checkout, revenue is directly impacted — a failed “Place Order” is a lost customer, not just an error.",
    method: "POST",
    endpoint: "/orders",
    requestBody: {
      restaurant: "Burger Barn",
      items: [{ name: "Classic Cheeseburger Combo", qty: 1 }],
      total: 349,
    },
  },
  {
    op: "PUT",
    crud: "Update",
    tab: "Change address",
    icon: "pencil",
    scenario:
      "Rahul realises he typed his old flat address. He edits it before the food is out for delivery.",
    userSees:
      "The delivery address visibly changes, and a note confirms the driver has the new route.",
    behindScenes:
      "The app sends only the changed field. The backend updates the existing order row — same order, new address — and re-routes the driver.",
    apiHelps:
      "A PUT request modifies data that already exists. The order isn't recreated; it's edited in place.",
    insight:
      "Poor update flows reduce user trust and increase support tickets — if editing feels risky, users call support instead.",
    method: "PUT",
    endpoint: "/orders/ORD-4815/address",
    requestBody: {
      address: "42, 1st Main, Indiranagar, Bangalore",
    },
  },
  {
    op: "DELETE",
    crud: "Delete",
    tab: "Cancel order",
    icon: "trash",
    scenario:
      "Plans changed. Rahul cancels the order before the restaurant starts preparing it.",
    userSees:
      "The order status flips to “Cancelled”, it disappears from active orders, and a refund message appears.",
    behindScenes:
      "The app tells the backend to cancel the order. The order row is removed from active orders and a refund is initiated.",
    apiHelps:
      "A DELETE request removes or deactivates data. Most products “soft delete” so the record can still be audited.",
    insight:
      "Cancellation policies affect both customer satisfaction and restaurant operations — too strict frustrates users, too loose hurts restaurants.",
    method: "DELETE",
    endpoint: "/orders/ORD-4815",
  },
];

export interface OrderSnapshot {
  orderId: string;
  restaurant: string;
  item: string;
  total: number;
  status: string;
  eta: string;
  driver: string;
  address: string;
}

export const INITIAL_ORDER: OrderSnapshot = {
  orderId: "ORD-4815",
  restaurant: "Burger Barn",
  item: "Classic Cheeseburger Combo",
  total: 349,
  status: "Preparing",
  eta: "28 min",
  driver: "Imran K.",
  address: "221B, 5th Block, Koramangala, Bangalore",
};

export const UPDATED_ADDRESS = "42, 1st Main, Indiranagar, Bangalore";
export const INITIAL_DB_COUNT = 1284;
