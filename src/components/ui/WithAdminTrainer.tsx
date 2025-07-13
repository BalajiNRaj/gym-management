"use client";

import { useSession } from "next-auth/react";
import Empty from "./Empty";
import Loader from "./Loader";

interface WithAdminTrainerProps {
  Component: React.ComponentType<Record<string, unknown>>;
}

const WithAdminTrainer = ({
  Component,
}: WithAdminTrainerProps): React.ComponentType<Record<string, unknown>> => {
  const AdminTrainerComponent: React.FC<Record<string, unknown>> = (props) => {
    const { data, status } = useSession();

    if (status === "loading") {
      return <Loader />;
    }

    if (!data?.user) {
      return (
        <Empty
          title="Unauthorized"
          subtitle="Please log in to access this page."
        />
      );
    }

    const isAdminOrTrainer =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data.user as any).role === "admin" || (data.user as any).role === "trainer";

    if (!isAdminOrTrainer) {
      return (
        <Empty
          title="Unauthorized"
          subtitle="You don't have permission to access this page."
        />
      );
    }

    return <Component {...props} />;
  };

  return AdminTrainerComponent;
};

export default WithAdminTrainer;
