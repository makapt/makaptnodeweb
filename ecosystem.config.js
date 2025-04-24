module.exports = {
  apps: [
    {
      name: "makapt-app",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_ENV: "production",
        NEXT_PUBLIC_API_BASE_URL: "/api",
        NEXT_PUBLIC_RAZORPAY_KEY_ID: "rzp_live_v0qd7mJRoytFGf"
      }
    }
  ]
};

