import { useQuery } from "@tanstack/react-query";

export interface ConfiguratorOptionInfo {
  info: string;
  forMe: string;
}

export interface ConfiguratorStepInfo {
  stepInfo: string;
  docUrl?: string;
  options: Record<string, ConfiguratorOptionInfo>;
}

export type ConfiguratorInfoData = Record<string, ConfiguratorStepInfo>;

export function useConfiguratorInfo() {
  return useQuery<ConfiguratorInfoData>({
    queryKey: ["configurator-info"],
    queryFn: async () => {
      const res = await fetch("/api/configurator-info");
      if (!res.ok) return {};
      const data = await res.json();
      return (data.info as ConfiguratorInfoData) ?? {};
    },
    staleTime: 10 * 60 * 1000,
  });
}
