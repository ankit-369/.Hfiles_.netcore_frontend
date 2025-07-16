'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MasterHome from '../components/MasterHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { CreateData, QuerySubmit, Verify } from '../services/HfilesServiceApi';
import { decryptData } from '../utils/webCrypto';
import { toast, ToastContainer } from 'react-toastify';

// Type definitions
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
    image_padding?: boolean;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

interface CreateOrderPayload {
  userId: number;
  amount: number;
  planName: string;
}

interface VerifyPaymentPayload {
  userId: number;
  orderId: string;
  paymentId: string;
  signature: string;
  planName: string;
}

declare global {
  interface Window {
    Razorpay: {
      new(options: RazorpayOptions): {
        open(): void;
        close(): void;
      };
    };
  }
}

const SubscriptionCards: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<{ standard: boolean; premium: boolean }>({
    standard: false,
    premium: false
  });

  const [formData, setFormData] = useState({
    email: '',
    query: '',
  });

  const handleQuerySubmit = async () => {
  const email = formData.email.trim();
  const query = formData.query.trim();

  if (!email || !query) {
    toast.error('Please fill out all required fields');
    return;
  }

  const payload = {
    email,
    queryText: query,
  };

  try {
    const response = await QuerySubmit(payload);
    toast.success(response.data.message );
    setFormData({ email: '', query: '' });
    setIsModalOpen(false);
  } catch (error: any) {
    console.error("Error response:", error.response?.data);
  }
};



  const getUserId = async (): Promise<number> => {
    try {
      const encryptedUserId = localStorage.getItem("userId");
      if (!encryptedUserId) return 0;
      const userIdStr = await decryptData(encryptedUserId);
      return parseInt(userIdStr, 10);
    } catch (error) {
      console.error("Error getting userId:", error);
      return 0;
    }
  };
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Standard Plan Payment Handler
  const handleStandardPayment = async (): Promise<void> => {
    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded. Please try again.');
      return;
    }
    const currentUserId = await getUserId();
    if (!currentUserId) {
      toast.error("Please log in to view members.");
      return;
    }

    setLoading(prev => ({ ...prev, standard: true }));

    try {
      // Create order payload
      const createOrderPayload: CreateOrderPayload = {
        userId: currentUserId,
        amount: 99,
        planName: 'Standard'
      };
      // Call your CreateData API
      const orderResponse = await CreateData(createOrderPayload);
      if (!orderResponse.data || !orderResponse.data.orderId) {
        throw new Error('Failed to create order');
      }
      const orderData = orderResponse.data;
      // Razorpay options
      const options: RazorpayOptions = {
        key: "rzp_live_kpCWRpxOkiH9M7",
        amount: createOrderPayload.amount,
        currency: "INR",
        name: "Hfiles",
        description: "Standard Plan Subscription",
        order_id: orderData.orderId,
        image: "https://hfiles.in/wp-content/uploads/2022/11/hfileslogo.jpeg",
        prefill: {
          name: "HEALTH FILES MEDICO PRIVATE LIMITED",
          email: "contact@hfiles.in",
          contact: "+919978043453",
        },
        notes: {
          address: "Hello World",
          merchant_order_id: "12312321",
        },
        theme: {
          color: "#0331B5",
          image_padding: false
        },
        handler: async function (response: RazorpayResponse) {
          await handlePaymentSuccess(response, 'Standard', orderData.orderId);
        },
        modal: {
          ondismiss: function () {
            setLoading(prev => ({ ...prev, standard: false }));
          },
          escape: true,
          backdropclose: false
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Standard payment initiation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setLoading(prev => ({ ...prev, standard: false }));
    }
  };

  // Premium Plan Payment Handler
  const handlePremiumPayment = async (): Promise<void> => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please try again.');
      return;
    }
    const currentUserId = await getUserId();
    if (!currentUserId) {
      toast.error("Please log in to view members.");
      return;
    }

    setLoading(prev => ({ ...prev, premium: true }));

    try {
      // Create order payload
      const createOrderPayload: CreateOrderPayload = {
        userId: currentUserId,
        amount: 399, // Rs. 399 in paise
        planName: 'Premium'
      };
      // Call your CreateData API
      const orderResponse = await CreateData(createOrderPayload);

      if (!orderResponse.data || !orderResponse.data.orderId) {
        throw new Error('Failed to create order');
      }

      const orderData = orderResponse.data;

      // Razorpay options
      const options: RazorpayOptions = {
        key: "rzp_live_kpCWRpxOkiH9M7",
        amount: createOrderPayload.amount,
        currency: "INR",
        name: "Hfiles",
        description: "Premium Plan Subscription",
        order_id: orderData.orderId,
        image: "https://hfiles.in/wp-content/uploads/2022/11/hfileslogo.jpeg",
        prefill: {
          name: "HEALTH FILES MEDICO PRIVATE LIMITED",
          email: "contact@hfiles.in",
          contact: "+919978043453",
        },
        notes: {
          address: "Hello World",
          merchant_order_id: "12312321",
        },
        theme: {
          color: "#0331B5",
          image_padding: false
        },
        handler: async function (response: RazorpayResponse) {
          await handlePaymentSuccess(response, 'Premium', orderData.orderId);
        },
        modal: {
          ondismiss: function () {
            setLoading(prev => ({ ...prev, premium: false }));
          },
          escape: true,
          backdropclose: false
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Premium payment initiation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setLoading(prev => ({ ...prev, premium: false }));
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (
    response: RazorpayResponse,
    plan: string,
    orderId: string
  ): Promise<void> => {
    try {
      setLoading(prev => ({
        ...prev,
        [plan.toLowerCase()]: true
      }));

      const currentUserId = await getUserId();
      if (!currentUserId) {
        toast.error("Please log in to view members.");
        return;
      }
      // Create verify payment payload
      const verifyPayload: VerifyPaymentPayload = {
        userId: currentUserId,
        orderId: orderId,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        planName: plan
      };
      const verifyResponse = await Verify(verifyPayload);
      toast.success('Payment is successfully Done...')
      window.location.href = '/SubscriptionPlan';
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast.success('Payment verification failed')
    } finally {
      setLoading(prev => ({
        ...prev,
        [plan.toLowerCase()]: false
      }));
    }
  };

  return (
    <MasterHome>
      <div className="h-[calc(100vh-80px)] sm:h-[calc(100vh-90px)] md:h-[calc(100vh-100px)] lg:h-[calc(100vh-139px)] 2xl:h-[calc(100vh-140px)] bg-gray-50 py-8">
        {/* Back to Home Button */}
        <div className="flex justify-start px-4 md:px-8 mb-6">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>

        {/* Main Title Section */}
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
            Subscription Plans
          </h1>
          <div className="border border-blue-800 w-35 mx-auto mb-2"></div>
          <p className="text-black font-medium max-w-2xl mx-auto px-4">
            Choose a plan that fits your needs and stay in control of your health — every step of the way.
          </p>
        </div>
        <div className='border mb-3 mx-auto' ></div>

        {/* Cards Container */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ backgroundColor: '#b0dcd4' }}>
              <div className="text-center mb-9">
                <h3 className="text-2xl font-bold text-blue-800 ">Basic</h3>
                <div className="text-4xl font-bold text-gray-800">Free</div>
              </div>

              <hr className="border-gray-800 mb-6" />

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-black font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Add upto 5 members</span>
                </div>

                <div className="flex items-center text-sm text-black font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>100 MB storage</span>
                </div>
                <div className="flex items-center text-sm text-black font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Upload PDF files</span>
                </div>
                <div className="flex items-center text-sm text-black font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Access to articles</span>
                </div>
                <div className="flex items-center text-sm text-black font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span className="line-through text-black">Wellness kit</span>
                </div>
                <div className="flex items-center text-sm text-black font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span className="line-through text-black">Membership card</span>
                </div>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ backgroundColor: '#fff44c' }}>
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Standard</h3>
                <div className="text-2xl font-bold text-gray-800">Rs. 99/year</div>
                <div className="text-sm text-black font-medium line-through">Rs. 149/year</div>
              </div>

              <hr className="border-gray-800 mb-6" />

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Add upto 7 members</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>300 MB storage</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Upload PDF files</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Wellness kit</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Access to exclusive article</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Membership card</span>
                </div>
              </div>

              <button
                onClick={handleStandardPayment}
                disabled={loading.standard}
                className="w-full bg-blue-800 hover:bg-blue-700 cursor-pointer disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {loading.standard ? 'Processing...' : 'Go Standard'}
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ backgroundColor: '#f8ccc4' }}>
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Premium</h3>
                <div className="text-2xl font-bold text-gray-800">Rs. 399/year</div>
                <div className="text-sm text-black font-medium line-through">Rs. 799/year</div>
              </div>

              <hr className="border-gray-800 mb-6" />

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Add upto 10 members</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>1000 MB storage</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Upload PDF, video files</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Wellness kit</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Access to exclusive article</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Premium membership card</span>
                </div>
              </div>

              <button
                onClick={handlePremiumPayment}
                disabled={loading.premium}
                className="w-full bg-blue-800 hover:bg-blue-700 cursor-pointer disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {loading.premium ? 'Processing...' : 'Go Premium'}
              </button>
            </div>

            {/* Advanced Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ backgroundColor: '#90bcfc' }}>
              <div className="text-center mb-9">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Advanced</h3>
                <div className="text-2xl font-bold text-gray-800">Contact Sales</div>
              </div>

              <hr className="border-gray-800 mb-6" />

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Add unlimited members</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Unlimited storage</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Membership card</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Wellness program</span>
                </div>
                <div className="flex items-center text-sm font-bold">
                  <FontAwesomeIcon icon={faCircleCheck} className=" w-5 h-5 mr-3" />
                  <span>Personalized solutions</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-800 cursor-pointer hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-10"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-6 rounded-lg relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-4 text-2xl cursor-pointer hover:text-gray-600"
              >
                ×
              </button>

              <h3 className="text-xl font-bold mb-2">Drop us your query and we'll get in touch with you</h3>
              <p className="text-gray-600 mb-4">Please share some details regarding your query</p>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Business email*</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <small className="text-gray-500">No spam, we promise!</small>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Your query*</label>
                  <textarea
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    placeholder="Tell us how we can help"
                    rows={4}
                    maxLength={20} 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleQuerySubmit}
                  className="primary text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors border-none"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </MasterHome>
  );
};

export default SubscriptionCards;