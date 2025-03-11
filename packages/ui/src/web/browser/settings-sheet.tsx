// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@allyson/ui/sheet";
import { Card, CardDescription, CardTitle } from "@allyson/ui/card";
import { useUser } from "@allyson/context";

import { Switch } from "@allyson/ui/switch";
import {
  IconChevronDown,
  IconPlus,
  IconSettings,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Textarea } from "@allyson/ui/textarea";
import { Input } from "@allyson/ui/input";
import { Label } from "@allyson/ui/label";
import { Button } from "@allyson/ui/button";
import { toast } from "sonner";

export default function SettingsSheet({
  sessionStatus,
  maxSteps,
  setMaxSteps,
  sessionVariables,
  setSessionVariables,
  sessionDetails,
  setSessionDetails,
}) {
  const { loading, user, makeAuthenticatedRequest } = useUser();
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [globalVariables, setGlobalVariables] = useState([
    { name: "", value: "" },
  ]);
  const [globalDetails, setGlobalDetails] = useState("");
  const [editingIndex, setEditingIndex] = useState(0);
  const [globalEditingIndex, setGlobalEditingIndex] = useState(0);
  const [showSessionSettings, setShowSessionSettings] = useState(false);

  function handleAddGlobalVariable() {
    setGlobalVariables([...globalVariables, { name: "", value: "" }]);
    setGlobalEditingIndex(globalVariables.length);
  }

  function handleAddSessionVariable() {
    setSessionVariables([...sessionVariables, { name: "", value: "" }]);
    setEditingIndex(sessionVariables.length);
  }

  function handleEditGlobalVariable(index) {
    setGlobalEditingIndex(index);
  }

  function handleEditSessionVariable(index) {
    setEditingIndex(index);
  }

  function handleSaveGlobalVariable(index) {
    setGlobalEditingIndex(null);
  }

  function handleSaveSessionVariable(index) {
    setEditingIndex(null);
  }

  function handleCancelSessionVariable() {
    setEditingIndex(null);
  }

  function handleCancelGlobalVariable() {
    setGlobalEditingIndex(null);
  }

  function handleDeleteGlobalVariable(index) {
    const newVariables = globalVariables.filter((_, i) => i !== index);
    setGlobalVariables(newVariables);
  }

  function handleDeleteSessionVariable(index) {
    const newVariables = sessionVariables.filter((_, i) => i !== index);
    setSessionVariables(newVariables);
  }

  const handleSaveGlobalSettings = async () => {
    try {
      setIsSending(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/user/save-global-settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            globalVariables: globalVariables,
            globalDetails: globalDetails,
          }),
        }
      );
      await response.json();

      toast.success("Global settings saved successfully.");
    } catch (error) {
      console.error("Error saving global settings:", error);
      toast.error("Failed to save global settings. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (user?.globalVariables) {
        setGlobalVariables(user.globalVariables);
        setGlobalEditingIndex(null);
      }
      if (user?.globalDetails) {
        setGlobalDetails(user.globalDetails);
      }
    }
  }, [user, loading]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button  variant="outline" size="icon" className="text-sm">
          <IconSettings id="step-2" className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
        </Button>
      </SheetTrigger>
      <SheetContent className="pb-20">
        <SheetHeader>
          <SheetTitle className="text-left">Settings</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto max-h-full hide-scrollbar pb-20">
          <div className="relative flex-auto overflow-y-auto">
            <Card  className="p-4 mt-4">
              <div
                className="flex flex-row justify-between items-center"
                onClick={() => setShowSessionSettings(!showSessionSettings)}
              >
                <div className="flex flex-col">
                  <CardTitle className="text-md font-medium ">
                    Session Settings
                  </CardTitle>
                  <CardDescription className="text-sm text-zinc-400">
                    Add details here before starting a session.
                  </CardDescription>
                </div>
                <IconChevronDown 
                  className={`h-[1.2rem] w-[1.2rem] text-zinc-400 transition-transform duration-300 ${
                    showSessionSettings ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`mt-4 ${showSessionSettings ? "block" : "hidden"}`}
              >
                <div className={`overflow-y-auto justify-between space-y-4`}>
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                      <CardTitle className="text-sm font-semibold text-zinc-200">
                        Variables
                      </CardTitle>
                      <CardDescription className="text-sm text-zinc-400">
                        Add any variable here that you want to be available to
                        Allyson. Such as API keys, Names, Addresses, etc.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-sm"
                      onClick={handleAddSessionVariable}
                      disabled={sessionStatus !== "inactive"}
                    >
                      <div className="flex flex-row items-center p-2">
                        <IconPlus className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                      </div>
                    </Button>
                  </div>
                  {sessionVariables.length > 0 &&
                    sessionVariables.map((variable, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            {editingIndex === index &&
                            sessionStatus === "inactive" ? (
                              <div className="flex gap-2 flex-1 items-center">
                                <Input
                                  value={variable.name}
                                  onChange={(e) => {
                                    const newVariables = [...sessionVariables];
                                    newVariables[index].name = e.target.value;
                                    setSessionVariables(newVariables);
                                  }}
                                  placeholder={`Variable ${index + 1}`}
                                  className="text-sm text-zinc-200"
                                  maxLength={200}
                                  disabled={sessionStatus !== "inactive"}
                                />
                                <div
                                  onClick={() =>
                                    handleSaveSessionVariable(index)
                                  }
                                  className="cursor-pointer"
                                >
                                  <IconCheck className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                                </div>
                                <div
                                  onClick={handleCancelSessionVariable}
                                  className="cursor-pointer"
                                >
                                  <IconX className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                                </div>
                              </div>
                            ) : (
                              <Label
                                className="text-sm text-zinc-200 cursor-pointer hover:text-zinc-300"
                                onClick={() => handleEditSessionVariable(index)}
                              >
                                {variable.name || `Variable ${index + 1}`}
                              </Label>
                            )}
                            {editingIndex !== index && (
                              <div
                                onClick={() =>
                                  handleDeleteSessionVariable(index)
                                }
                                className="ml-2 cursor-pointer"
                              >
                                <IconX className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                              </div>
                            )}
                          </div>
                          <Input
                            value={variable.value}
                            onChange={(e) => {
                              const newVariables = [...sessionVariables];
                              newVariables[index].value = e.target.value;
                              setSessionVariables(newVariables);
                            }}
                            placeholder="Value"
                            className="text-sm"
                            maxLength={1000}
                            disabled={sessionStatus !== "inactive"}
                          />
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex flex-col mt-4">
                  <Label className="text-sm text-zinc-200 cursor-pointer hover:text-zinc-300">
                    Max Steps
                  </Label>
                  <CardDescription className="text-sm text-zinc-400 mb-1">
                    The maximum number of steps the agent can take.
                  </CardDescription>
                  <Input
                    value={maxSteps}
                    onChange={(e) => {
                      setMaxSteps(e.target.value);
                    }}
                    placeholder="Max Steps"
                    className="text-sm text-zinc-200"
                    type="number"
                    disabled={sessionStatus !== "inactive"}
                  />
                </div>
                <div className="overflow-y-auto justify-between space-y-4">
                  <div className="flex flex-col mt-4">
                    <CardTitle className="text-sm font-semibold  text-zinc-200">
                      Session Details
                    </CardTitle>
                    <CardDescription className="text-sm text-zinc-400">
                      Add any additional details here.
                    </CardDescription>
                  </div>
                  <Textarea
                    maxLength={1000}
                    value={sessionDetails}
                    onChange={(e) => {
                      setSessionDetails(e.target.value);
                    }}
                    disabled={sessionStatus !== "inactive"}
                  />
                </div>
              </div>
            </Card>
            <Card className="p-4 mt-4">
              <div
                className="flex flex-row justify-between"
                onClick={() => setShowGlobalSettings(!showGlobalSettings)}
              >
                <CardTitle className="text-md font-medium ">
                  Global Settings
                </CardTitle>
                <IconChevronDown
                  className={`h-[1.2rem] w-[1.2rem] text-zinc-400 transition-transform duration-300 ${
                    showGlobalSettings ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`mt-4 ${showGlobalSettings ? "block" : "hidden"}`}
              >
                {/* <div className="flex flex-col mt-4">
                  <CardTitle className="text-md font-semibold text-zinc-200">
                    Messages
                  </CardTitle>
                </div>
                <Card className="p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-md font-medium">
                        Evaluation
                      </CardTitle>
                    </div>
                    <Switch checked={true} />
                  </div>
                </Card>
                <Card className="p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-md font-medium">
                        Memory
                      </CardTitle>
                    </div>
                    <Switch checked={true} />
                  </div>
                </Card> */}
                <div
                  className={`overflow-y-auto justify-between space-y-4 mt-4`}
                >
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                      <CardTitle className="text-sm font-semibold text-zinc-200">
                        Variables
                      </CardTitle>
                      <CardDescription className="text-sm text-zinc-400">
                        Add any variable here that you want to be available to
                        Allyson. Such as API keys, Names, Addresses, etc.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-sm"
                      onClick={handleAddGlobalVariable}
                    >
                      <div className="flex flex-row items-center p-2">
                        <IconPlus className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                      </div>
                    </Button>
                  </div>
                  {globalVariables.map((variable, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          
                          {globalEditingIndex === index ? (
                            <div className="flex gap-2 flex-1 items-center">
                              <Input
                                value={variable.name}
                                onChange={(e) => {
                                  const newVariables = [...globalVariables];
                                  newVariables[index].name = e.target.value;
                                  setGlobalVariables(newVariables);
                                }}
                                placeholder={`Variable ${index + 1}`}
                                className="text-sm text-zinc-200"
                                maxLength={1000}
                              />
                              <div
                                onClick={() => handleSaveGlobalVariable(index)}
                                className="cursor-pointer"
                              >
                                <IconCheck className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                              </div>
                              <div
                                onClick={handleCancelGlobalVariable}
                                className="cursor-pointer"
                              >
                                <IconX className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                              </div>
                            </div>
                          ) : (
                            <Label
                              className="text-sm text-zinc-200 cursor-pointer hover:text-zinc-300"
                              onClick={() => handleEditGlobalVariable(index)}
                            >
                              {variable.name || `Variable ${index + 1}`}
                            </Label>
                          )}

                          <div
                            onClick={() => handleDeleteGlobalVariable(index)}
                            className="ml-2 cursor-pointer"
                          >
                            <IconX className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                          </div>
                        </div>
                        <Input
                          value={variable.value}
                          onChange={(e) => {
                            const newVariables = [...globalVariables];
                            newVariables[index].value = e.target.value;
                            setGlobalVariables(newVariables);
                          }}
                          placeholder="Value"
                          className="text-sm"
                          maxLength={1000}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="overflow-y-auto justify-between space-y-4">
                  <div className="flex flex-col mt-4">
                    <CardTitle className="text-sm font-semibold  text-zinc-200">
                      Additional Details
                    </CardTitle>
                    <CardDescription className="text-sm text-zinc-400">
                      Add any additional details here.
                    </CardDescription>
                  </div>
                  <Textarea
                    value={globalDetails}
                    onChange={(e) => {
                      setGlobalDetails(e.target.value);
                    }}
                    maxLength={1000}
                    disabled={isSending}
                  />
                </div>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={handleSaveGlobalSettings}
                  disabled={isSending}
                >
                  Save
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
