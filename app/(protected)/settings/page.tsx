"use client";

import { signOut } from "next-auth/react";

const settingsPage = () => {
  // const user = useCurrentUser();
  const onclick = () => {
    signOut();
  };
  return (
    <div className="bg-white p-10 rounded-xl">
      <button type="submit" onClick={onclick}>
        Sign out
      </button>
    </div>
  );
};

export default settingsPage;
