import React from "react";
import AssetTable from "../../_components/asset-table";

const AssetPage = ({ searchParams }: { searchParams: { page: string } }) => {
  return <AssetTable searchParams={searchParams} />;
};

export default AssetPage;
