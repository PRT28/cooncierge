"use client";

import React, { useState, useCallback, useMemo } from "react";
import SideSheet from "./SideSheet";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import ServiceInfoForm from "./forms/ServiceInfoForm";

// Type definitions
interface Service {
  id: string;
  title: string;
  image: string;
  category: "travel" | "accommodation" | "transport" | "activity";
  description?: string;
}

interface BookingFormSidesheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: Service | null;
  onFormSubmit?: (formData: any) => void;
  initialData?: any;
}

type TabType = "general" | "service" | "review";

interface TabConfig {
  id: TabType;
  label: string;
  component: React.ComponentType<any>;
  isEnabled: boolean;
}

const BookingFormSidesheet: React.FC<BookingFormSidesheetProps> = ({
  isOpen,
  onClose,
  selectedService,
  onFormSubmit,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [formData, setFormData] = useState<any>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Memoized tab configuration
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "general",
        label: "General Info",
        component: GeneralInfoForm,
        isEnabled: true,
      },
      {
        id: "service",
        label: "Service Info",
        component: ServiceInfoForm,
        isEnabled: !!selectedService,
      },
    ],
    [selectedService]
  );

  // Optimized tab click handler
  const handleTabClick = useCallback(
    (tabId: TabType) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab?.isEnabled) {
        setActiveTab(tabId);
      }
    },
    [tabs]
  );

  // Form data update handler
  const handleFormDataUpdate = useCallback((newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (data: any) => {
      if (!selectedService) return;

      setIsSubmitting(true);
      try {
        const completeFormData = {
          ...formData,
          ...data,
          service: selectedService,
        };
        await onFormSubmit?.(completeFormData);
        onClose();
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedService, onFormSubmit, onClose]
  );

  // Memoized tab buttons
  const tabButtons = useMemo(
    () =>
      tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
          px-4 py-2 text-sm font-medium border-b-2 transition-colors
          ${
            activeTab === tab.id
              ? "border-[#0D4B37] text-[#0D4B37]"
              : tab.isEnabled
              ? "border-transparent text-gray-500 hover:text-gray-700"
              : "border-transparent text-gray-300 cursor-not-allowed"
          }
        `}
          onClick={() => handleTabClick(tab.id)}
          disabled={!tab.isEnabled}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
        </button>
      )),
    [tabs, activeTab, handleTabClick]
  );

  // Memoized active tab content
  const activeTabContent = useMemo(() => {
    const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
    if (!activeTabConfig) return null;

    const Component = activeTabConfig.component;

    const commonProps = {
      formData,
      onFormDataUpdate: handleFormDataUpdate,
      onSubmit: handleFormSubmit,
      selectedService,
      isSubmitting,
    };

    return <Component {...commonProps} />;
  }, [
    activeTab,
    tabs,
    formData,
    handleFormDataUpdate,
    handleFormSubmit,
    selectedService,
    isSubmitting,
  ]);

  // Memoized title
  const title = useMemo(() => {
    if (!selectedService) return "Booking Form";
    return `${selectedService.title} - Booking Form`;
  }, [selectedService]);

  // Progress indicator
  const progress = useMemo(() => {
    const enabledTabs = tabs.filter((tab) => tab.isEnabled);
    const currentIndex = enabledTabs.findIndex((tab) => tab.id === activeTab);
    return ((currentIndex + 1) / enabledTabs.length) * 100;
  }, [tabs, activeTab]);

  return (
    <SideSheet isOpen={isOpen} onClose={onClose} title={title} width="xl">
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-0 p-6" role="tablist">
            {tabButtons}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto" role="tabpanel">
          {activeTabContent}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 mt-4">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <div className="flex space-x-2">
              {activeTab !== "general" && (
                <button
                  onClick={() => {
                    const currentIndex = tabs.findIndex(
                      (tab) => tab.id === activeTab
                    );
                    const prevTab = tabs[currentIndex - 1];
                    if (prevTab?.isEnabled) {
                      setActiveTab(prevTab.id);
                    }
                  }}
                  className="px-4 py-2 text-[#114958] border border-[#114958] rounded-lg hover:bg-[#114958] hover:text-white transition-colors"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}

              {activeTab !== "review" ? (
                <button
                  onClick={() => {
                    const currentIndex = tabs.findIndex(
                      (tab) => tab.id === activeTab
                    );
                    const nextTab = tabs[currentIndex + 1];
                    if (nextTab?.isEnabled) {
                      setActiveTab(nextTab.id);
                    }
                  }}
                  className="px-4 py-2 bg-[#114958] text-white rounded-lg hover:bg-[#0d3a45] transition-colors"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => handleFormSubmit(formData)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !selectedService}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SideSheet>
  );
};

export default React.memo(BookingFormSidesheet);
