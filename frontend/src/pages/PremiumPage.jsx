import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";

export default function PremiumPage() {
  const { user, isAuthenticated, token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await apiRequest("/api/payment/plans");
        setPlans(data);
      } catch (err) {
        setError(err.message || "Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleUpgrade = async (planId) => {
    if (!isAuthenticated) {
      window.location.href = "/auth?redirect=/premium";
      return;
    }

    if (user?.is_pro) {
      setError("You already have a Pro account!");
      return;
    }

    try {
      setSelectedPlan(planId);

      
      const orderResp = await apiRequest("/api/payment/razorpay/create-order", {
        method: "POST",
        token,
        body: { planType: planId },
      });

      
      await new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });

      const options = {
        key: orderResp.keyId,
        amount: orderResp.amount * 100,
        currency: orderResp.currency,
        name: "CodeFolio",
        description: `${planId} plan`,
        order_id: orderResp.orderId,
        handler: async function (paymentResponse) {
          try {
            await apiRequest("/api/payment/razorpay/verify", {
              method: "POST",
              token,
              body: {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                planType: planId,
              },
            });
            alert("Payment successful — your account is upgraded.");
            window.location.reload();
          } catch (e) {
            setError(e.message || "Payment verification failed");
          }
        },
        prefill: {
          email: user?.email,
          name: user?.name,
        },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to initiate payment");
    } finally {
      setSelectedPlan(null);
    }
  };

  if (loading) return <p className="center-message">Loading pricing plans...</p>;

  return (
    <div className="premium-page card">
      <div className="premium-header">
        <h1>Upgrade to Pro</h1>
        <p>Unlock premium features and take your portfolio to the next level.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      {user?.is_pro && (
        <div className="success-banner">
          <p>✓ You have a Pro account. Thank you for your support!</p>
        </div>
      )}

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="pricing-card">
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="amount">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: String(plan.currency || "inr").toUpperCase(),
                  maximumFractionDigits: 0,
                }).format(plan.price)}
              </span>
              <span className="billing">/{plan.billing}</span>
            </div>

            <ul className="features-list">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>

            <button
              className="btn btn-primary"
              onClick={() => handleUpgrade(plan.id)}
              disabled={selectedPlan === plan.id || user?.is_pro}
            >
              {selectedPlan === plan.id ? "Processing..." : user?.is_pro ? "Current Plan" : "Upgrade Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
