import { useEffect, useState } from "react";
import { DeviceType, getDeviceType } from "@/lib/constants";

export const useDeviceType = () => {
  const [device, setDevice] =
    useState<DeviceType>("desktop");

  useEffect(() => {
    const update = () => {
      setDevice(getDeviceType());
    };

    update();

    window.addEventListener("resize", update);

    return () =>
      window.removeEventListener("resize", update);
  }, []);

  return device;
};