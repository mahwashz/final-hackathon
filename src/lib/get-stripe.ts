import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
          const publishableKey ="pk_test_51QnQ8vQhAAkd1jeNMMOYj7iyERe2y4HjunFEJ7ZLPQOaGcntXB7abFvV3vBbVbneHlfZvo2AbcV7j5PyiYUkAVB500xsos2gJe"
   
    if (!publishableKey) {
      throw new Error("Stripe publishable key is not set. Please check your environment variables.")
    }
    console.log("Initializing Stripe with key:", publishableKey.substring(0, 8) + "...")
    stripePromise = loadStripe(publishableKey).catch((error) => {
      console.error("Error loading Stripe:", error)
      return null
    })
  }
  return stripePromise
}

