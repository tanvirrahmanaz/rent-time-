// client/src/components/pages/AboutPage.jsx
import React from "react";
import {
  Home,
  Users,
  Shield,
  Camera,
  MapPin,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Listed Homes", value: "3,200+", icon: Home },
  { label: "Verified Users", value: "12,000+", icon: Shield },
  { label: "Areas Covered", value: "60+ Thanas", icon: MapPin },
  { label: "Avg. Response", value: "< 2 hours", icon: Sparkles },
];

const values = [
  {
    title: "Trust & Safety First",
    desc:
      "NID-based verification, secure payments এবং report/review সিস্টেম—সব মিলিয়ে ট্রাস্টেড রেন্টাল এক্সপেরিয়েন্স।",
    icon: Shield,
  },
  {
    title: "Simple & Fast",
    desc:
      "Drag & drop photos, স্মার্ট ফর্ম, আর ইনস্ট্যান্ট পোস্টিং—সবই করা যায় কয়েক মিনিটে।",
    icon: Camera,
  },
  {
    title: "Fair & Transparent",
    desc:
      "স্পষ্ট ভাড়ার তথ্য, কোনোরকম হিডেন চার্জ নয়—tenant ও owner দু’পক্ষের জন্যই পরিষ্কার শর্ত।",
    icon: DollarSign,
  },
  {
    title: "Community Driven",
    desc:
      "Reviews, ratings, ও helpful tips—community feedback দিয়ে ভাল পোস্ট ওপরে আসে।",
    icon: Users,
  },
];

const faqs = [
  {
    q: "Rent Time কী?",
    a: "Rent Time হলো হাউস/রুম রেন্ট ও রুমমেট খোঁজার সহজ প্ল্যাটফর্ম। আপনি পোস্ট দিতে পারবেন, বুকিং রিকোয়েস্ট ম্যানেজ করতে পারবেন, আর ভেরিফাইড ইউজারের সাথে নিরাপদে যোগাযোগ করতে পারবেন।",
  },
  {
    q: "কীভাবে পোস্ট দেব?",
    a: "ড্যাশবোর্ড থেকে Create Listing-এ যান, বেসিক ডিটেইলস দিন, একাধিক ছবি ড্র্যাগ-ড্রপ করে আপলোড করুন, NID ভেরিফিকেশন দিন—তারপর Publish করুন।",
  },
  {
    q: "ভেরিফিকেশন কীভাবে কাজ করে?",
    a: "NID নম্বর ও ছবি কেবল ভেরিফিকেশনের জন্য ব্যবহৃত হয়—পাবলিকলি দেখানো হয় না। এটি ট্রাস্ট ও সেফটি নিশ্চিত করে।",
  },
  {
    q: "পেমেন্ট সেফ তো?",
    a: "ইন্টিগ্রেটেড পেমেন্ট গেটওয়ে (Stripe/Local Gateway) ব্যবহার করি। সফল পেমেন্টের পরে বুকিং স্ট্যাটাস আপডেট হয়।",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" /> About Rent Time
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            ভাড়া খোঁজা হোক <span className="text-indigo-600">সহজ</span>,
            <br className="hidden sm:block" />
            নিরাপদ আর <span className="text-indigo-600">দ্রুত</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Rent Time একটি ট্রাস্টেড প্ল্যাটফর্ম যেখানে মালিকেরা সহজে লিস্টিং
            করতে পারেন এবং ভাড়াটিয়ারা যাচাইকৃত তথ্য দেখে রিকোয়েস্ট পাঠাতে পারেন—
            সবকিছু একসাথে, এক জায়গায়।
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/create-post"
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
            >
              Create a Listing
            </Link>
            <Link
              to="/"
              className="px-5 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold text-gray-700"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-indigo-600">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-800">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values / Why Us */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          কেন <span className="text-indigo-600">Rent Time</span>?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          কীভাবে কাজ করে
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Create & Verify",
              desc: "Listing তৈরি করুন, ছবিগুলো drag & drop করে আপলোড করুন, তারপর NID verify করুন।",
              icon: CheckCircle2,
            },
            {
              title: "Discover & Request",
              desc: "ব্রাউজ করুন, লোকেশন/প্রাইস/টাইপ দিয়ে ফিল্টার করুন, তারপর বুকিং রিকোয়েস্ট পাঠান।",
              icon: MapPin,
            },
            {
              title: "Confirm & Pay",
              desc: "Owner approve করলে পেমেন্ট করুন এবং মুভ-ইনের জন্য রেডি হন।",
              icon: DollarSign,
            },
          ].map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          সাধারণ জিজ্ঞাসা (FAQ)
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {faqs.map(({ q, a }, i) => (
            <details
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <summary className="cursor-pointer font-semibold text-gray-900">
                {q}
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-800">
                আরও জানতে চান?
              </h3>
              <p className="mt-2 text-gray-600">
                আমাদের সাপোর্ট টিম আপনার প্রশ্নের উত্তর দিতে প্রস্তুত।
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <a
                  href="mailto:support@renttime.app"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4" />
                  support@renttime.app
                </a>
                <a
                  href="tel:+8801000000000"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
                >
                  <Phone className="w-4 h-4" />
                  +880 10-0000-0000
                </a>
              </div>
            </div>
            <div className="flex items-end md:justify-end">
              <Link
                to="/create-post"
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
              >
                Create Your Listing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
