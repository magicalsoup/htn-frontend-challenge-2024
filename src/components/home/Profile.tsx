import useSession from "@/session/use-session";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label";
import HTN_LOGO from "@/static/htn-icon.jpg"
import {
    Collapsible,
    CollapsibleContent,
  } from "@/components/ui/collapsible"
import { useEventsDispatch, useEventsState } from "../events-context/EventContext";
import { ChevronsUpDown } from "lucide-react";
import { X } from "lucide-react"
import { EventContextActionType } from "@/schema/events-context-types";
import { formatTimeInterval } from "@/lib/format";
import { Badge } from "../ui/badge";

export function Profile() {
    const { session, logout } = useSession()
    const [loggingOut, toggleLoggingOut] = useState(false)
    const [openCollapsible, toggleOpenCollapsible] = useState(true)
    
    const router = useRouter()
    const eventsState = useEventsState()
    const eventsDispatch = useEventsDispatch()

    useEffect(() => {
        if (session.isLoggedIn) {
            toggleLoggingOut(false)
        }
    }, [session.isLoggedIn, toggleLoggingOut])

    useEffect(() => {
        if (loggingOut) {
            router.replace("/login")
        }
    }, [loggingOut, router])

    if (!session.isLoggedIn) {
        return (
            <div className="">
                 <span>
                    <Button variant="link" onClick={() => {
                        router.replace('/login')   
                    }}>
                        Click here to log in
                    </Button>
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-80 gap-y-6">
            <h1 className="text-3xl font-bold">Hacker profile</h1>
            <div className="flex flex-col justify-center p-4 gap-y-4 h-36 outline outline-1 outline-border rounded-md">
                <div className="flex gap-x-4 items-center">
                    <Avatar>
                        <AvatarImage src={HTN_LOGO.src}/>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Label>{session.username}</Label>
                    <Badge variant="outline">Hacker</Badge>
                </div>
                <Button onClick={() => {
                    toggleLoggingOut(true)
                    logout()
                }}>Log out</Button>
            </div>
            <div className="flex flex-col">
                <div className="flex">
                <h1 className="text-xl font-bold">Your picks</h1>
                    <Button variant="ghost" size="sm" className="w-9 p-0" onClick={
                        () => toggleOpenCollapsible((old) => !old)
                    }>
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </div>
                <Collapsible open={openCollapsible} onOpenChange={toggleOpenCollapsible}>
                    <CollapsibleContent className="space-y-2">
                    {eventsState.interestedEvents.map((event, id:number) => {
                        return <div key={id} className="flex justify-between items-center rounded-md border px-4 py-3 text-sm">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold">{event.name}</span>
                                <span className="text-xs">{formatTimeInterval(event.start_time, event.end_time)}</span>
                            </div>
                            <Button variant="outline" className="hover:bg-gray-200" onClick={() => {
                                    eventsDispatch({
                                        type: EventContextActionType.DESELECT_EVENT_AS_INTERESTED,
                                        event: event
                                    })}}>
                                <X/>
                            </Button>
                        </div>
                    })}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    )
}