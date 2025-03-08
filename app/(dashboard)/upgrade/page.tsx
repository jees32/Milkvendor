
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a custom button component
import Link from 'next/link';

type Props = {};

const UpgradePage = (props: Props) => {
  return (
    <div className="py-8 bg-gray-50 -mt-24">
      <div className="max-w-screen-lg mx-auto text-center">
       
        <p className="text-md text-gray-500 mb-10">
          Choose a plan that suits your business needs. With our scalable pricing options, you can upgrade your account to unlock more retailer management features, including advanced insights, more retailer accounts, and premium support.
        </p>

        {/* Pricing Plans Section */}
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">Pricing Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Free Plan</h3>
            <p className="text-xl font-semibold text-gray-700 mt-2">0/month</p>
            <p className="text-gray-600 mt-4">- 20 Retailer Accounts</p>
            <p className="text-gray-600">- Basic Transaction Tracking</p>
            <p className="text-gray-600">- Limited Insights and Reports</p>
            <Button type="submit" className="mt-6 w-full bg-black text-white hover:bg-gray-800 rounded-xl">
              <Link href="/sign-up?plan=free">Sign Up</Link>
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Premium Plan</h3>
            <p className="text-xl font-semibold text-gray-700 mt-2">₹1000/month</p>
            <p className="text-gray-600 mt-4">- 2000 Retailer Accounts</p>
            <p className="text-gray-600">- Advanced Transaction Tracking</p>
            <p className="text-gray-600">- Detailed Business Insights</p>
            <Button className="mt-6 w-full bg-black text-white hover:bg-gray-800 rounded-xl">
              <Link href="/sign-up?plan=premium">Sign Up</Link>
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Enterprise Plan</h3>
            <p className="text-xl font-semibold text-gray-700 mt-2">₹3000/month</p>
            <p className="text-gray-600 mt-4">- Unlimited Retailer Accounts</p>
            <p className="text-gray-600">- Full Customization and Reports</p>
            <p className="text-gray-600">- Priority Support</p>
            <Button className="mt-6 w-full bg-black text-white hover:bg-gray-800 rounded-xl">
              <Link href="/sign-up?plan=enterprise">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700">Already have an account?</p>
          <Button className="mt-4 bg-gray-800 text-white rounded-xl">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
