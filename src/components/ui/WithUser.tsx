"use client";

import { useSession } from "next-auth/react";
import Empty from "./Empty";
import Loader from "./Loader";
import React from "react";

interface WithUserProps<P> {
  Component: React.ComponentType<P>;
}

const WithUser = <P extends Record<string, unknown>>({ Component }: WithUserProps<P>) => {
  const UserComponent: React.FC<P> = (props) => {
    const { data, status } = useSession();
    const sessionUser = data?.user as Record<string, unknown> | undefined;

    if (status === "loading") {
      return <Loader />;
    }

    if (sessionUser?.role !== "user") {
      return (
        <Empty
          title="Unauthorized"
          subtitle="You ain't authorized for this page."
        />
      );
    }

    return <Component {...props} />;
  };
  return UserComponent;
};

export default WithUser;
