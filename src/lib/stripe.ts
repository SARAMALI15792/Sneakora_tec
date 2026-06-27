import Stripe from "stripe";
import https from "https";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const fastDnsAgent = new https.Agent({
  keepAlive: true,
  lookup: (hostname, opts, cb) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err || !addresses?.length) {
        dns.lookup(hostname, opts, cb);
        return;
      }
      if (opts.all) {
        cb(null, addresses.map(a => ({ address: a, family: 4 })), 4);
      } else {
        cb(null, addresses[0], 4);
      }
    });
  },
});

export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_placeholder") return null;
  return new Stripe(key, { httpAgent: fastDnsAgent });
}
