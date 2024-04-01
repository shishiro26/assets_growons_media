import React from "react";
import Image from "next/image";
import AddMoneyForm from "../../_components/add-money";
import DownloadButton from "@/components/shared/download";
import { db } from "@/lib/db";

import TopBar from "@/app/(protected)/_components/Topbar";
import CopyButton from "@/components/shared/copy-button";

export const generateMetadata = () => {
  return {
    title: "Add Money | GrowonsMedia",
    description: "Add money to your account",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const bankDetails = await db.bankDetails.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Add Money" />
      </div>
      <section className="mt-4 mx-2">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-[50%]">
            <div className="mt-2">
              <p>Scan the QR below:</p>
              {bankDetails && (
                <div className="flex flex-row items-center">
                  <Image
                    key={bankDetails.public_id}
                    src={bankDetails.secure_url ?? ""}
                    alt="QR-CODE"
                    width={150}
                    height={150}
                    className=" w-40 h-40 m-2"
                  />
                  <div className="flex flex-col">
                    <div>
                      <span className="block">UPI ID:</span>
                      <span className="font-semibold border-2 border-black p-1 rounded-lg flex items-center gap-x-2 justify-between">
                        {bankDetails?.upiid}
                        <CopyButton text={bankDetails.upiid} />
                      </span>
                    </div>
                    <div>
                      <span className="block">UPI Number:</span>
                      <span className="font-semibold border-2 border-black p-1 rounded-lg flex items-center gap-x-2 justify-between">
                        {bankDetails?.upinumber}
                        <CopyButton text={bankDetails.upinumber} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DownloadButton imageLink={bankDetails?.secure_url ?? ""} />
            <AddMoneyForm
              userId={params.id.toString()}
              bankDetails={bankDetails}
            />
          </div>
          <div className="md:w-[50%] flex flex-col-reverse md:flex-col gap-y-2">
            <div>
              <p className="font-bold font-2xl mb-2">Bank Details :</p>
              <div className="flex items-center flex-wrap">
                <span>Name:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.name}
                  {bankDetails && <CopyButton text={bankDetails.name} />}
                </span>
              </div>
              <div className="flex items-center">
                <span>IFSC Code:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.ifsccode}
                  {bankDetails && <CopyButton text={bankDetails.ifsccode} />}
                </span>
              </div>
              <div className="flex items-center">
                <span>Account type:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.accountType}
                  {bankDetails && <CopyButton text={bankDetails.accountType} />}
                </span>
              </div>
              <div className="flex items-center">
                <span>Bank Name:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.bankName}
                  {bankDetails && <CopyButton text={bankDetails.bankName} />}
                </span>
              </div>
              <div className="flex items-center">
                <span>Account Number:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.accountDetails}
                  {bankDetails && (
                    <CopyButton text={bankDetails.accountDetails} />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
