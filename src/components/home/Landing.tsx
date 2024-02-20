"use client"

import { useEffect, useState } from "react"
import { TEvent } from "@/app/schema/types"
import { getDayOfWeek } from "@/lib/format"
import { DayTabs } from "@/components/home/DayTabs"
import useSession from "@/session/use-session"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/home/SearchBar"
import { useEventsDispatch, useEventsState } from "../events-context/EventContext"
import { EventContextActionType } from "@/app/schema/events-context-types"

const API_ENDPOINT = `https://api.hackthenorth.com/v3/`

async function getEvents() {
    const req = `${API_ENDPOINT}/events`
    const events = await fetch(req).then(res => res.json())
    return events
}

export function Landing () {
    const { session, isLoading, logout } = useSession()
    
    const eventsDispatch = useEventsDispatch()
    const eventsState = useEventsState() 

    const [events, setEvents] = useState<TEvent[]>([])
    // const [filteredEvents, setFilteredEvents] = useState<TEvent[]>([])
    const [eventDays, setEventDays] = useState<string[]>([])
    const [startDay, setStartDay] = useState<string>("Tuesday")

    useEffect(() => {
        async function fetchEvents() {
            const fetchedEvents = (await getEvents()).sort((a: TEvent, b: TEvent) => {
              if (a.start_time < b.start_time) { // sort events by start time
                return -1;
              }
              return 1;
            }).filter((event: TEvent) => event.permission === "public" || session.isLoggedIn)
            setEvents([...fetchedEvents])

            eventsDispatch({
                type: EventContextActionType.INITIALIZE_EVENTS,
                events: [...fetchedEvents]
            })

            // console.log(fetchedEvents)
          }
          fetchEvents()
    }, [session])

    useEffect(() => {
        const newEventDays = Array.from(new Set (events.map((event) => {
            return getDayOfWeek(event.start_time)
        })))
        setEventDays(newEventDays)
        setStartDay(newEventDays[0])
    }, [events])

    if (isLoading) {
      return (
        <div>Loading</div>
      )
    }

    return (
        <main className="h-screen w-screen">
            <div className="flex flex-col py-32 px-32">
                <SearchBar />
                <Button type="submit" onSubmit={() => logout()}>Log out</Button>
                <h1>Username: {session.username} isLoggedin: {JSON.stringify(session.isLoggedIn)}</h1>
                <div className="flex">
                    <DayTabs eventDays={eventDays} startDay={startDay}/>
                </div>
            </div>
        </main>
    )
}