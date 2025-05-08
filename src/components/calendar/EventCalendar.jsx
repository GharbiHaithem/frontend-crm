import { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Container, Divider } from "@mui/material";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import EventInfo from "./EventInfo";
import AddEventModal from "./AddEventModal";
import EventInfoModal from "./EventInfoModal";
import { AddTodoModal } from "./AddTodoModal";
import AddDatePickerEventModal from "./AddDatePickerEventModal";
import AddEventReunion from "./AddEventReunion";
import AddEventTache from "./AddEventTache";
import AddEventVisite from "./AddEventVisite";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const initialEventFormState = {
  description: "",
  todoId: undefined,
  type: "",
};

const initialDatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  end: undefined,
  type: "",
};

const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString();

const EventCalendar = () => {
  const [openSlot, setOpenSlot] = useState(false);
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [openReunionModal, setOpenReunionModal] = useState(false);
  const [openVisiteModal, setOpenVisiteModal] = useState(false);
  const [openTacheModal, setOpenTacheModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventInfoModal, setEventInfoModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [eventFormData, setEventFormData] = useState(initialEventFormState);
  const [datePickerEventFormData, setDatePickerEventFormData] = useState(initialDatePickerEventFormData);
  const [selectedEventType, setSelectedEventType] = useState(null);

  const handleSelectSlot = (event) => {
    setOpenSlot(true);
    setCurrentEvent(event);
  };

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setEventInfoModal(true);
  };

  const handleClose = () => {
    setEventFormData(initialEventFormState);
    setOpenSlot(false);
  };

  const handleDatePickerClose = () => {
    setDatePickerEventFormData(initialDatePickerEventFormData);
    setOpenDatepickerModal(false);
  };

  const onAddEvent = (e) => {
    e.preventDefault();

    const data = {
      ...eventFormData,
      _id: generateId(),
      start: currentEvent?.start,
      end: currentEvent?.end,
    };

    const newEvents = [...events, data];
    setEvents(newEvents);
    handleClose();
  };

  const onAddEventFromDatePicker = (e) => {
    e.preventDefault();

    const addHours = (date, hours) => {
      return date ? new Date(date.getTime() + hours * 60 * 60 * 1000) : undefined;
    };

    const setMinToZero = (date) => {
      if (!date) return undefined;
      const newDate = new Date(date);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      return newDate;
    };

    const data = {
      ...datePickerEventFormData,
      _id: generateId(),
      start: setMinToZero(datePickerEventFormData.start),
      end: datePickerEventFormData.allDay 
        ? addHours(datePickerEventFormData.start, 12) 
        : setMinToZero(datePickerEventFormData.end),
    };

    const newEvents = [...events, data];
    setEvents(newEvents);
    setDatePickerEventFormData(initialDatePickerEventFormData);
  };

  const onDeleteEvent = () => {
    setEvents(events.filter((e) => e._id !== currentEvent._id));
    setEventInfoModal(false);
  };

  return (
    <Box mt={1} mb={2} component="main" sx={{ flexGrow: 1, py: 1 }}>
      <Container maxWidth={false}>
        <Card>
          <CardHeader title="Calendar" subheader="Create Events and Todos and manage them easily" />
          <Divider />
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={() => setSelectedEventType("open")} size="small" variant="contained">
                Create
              </Button>

              {selectedEventType === "open" && (
                <Box>
                  <select
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      setSelectedEventType(selectedType);
                      if (selectedType === "reunion") {
                        setOpenReunionModal(true);
                      } else if (selectedType === "visite") {
                        setOpenVisiteModal(true);
                      } else if (selectedType === "tache") {
                        setOpenTacheModal(true);
                      }
                    }}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    <option value="">Select type...</option>
                    <option value="visite">Visit</option>
                    <option value="tache">Task</option>
                  </select>
                </Box>
              )}

              <Button onClick={() => setOpenTodoModal(true)} size="small" variant="contained">
                Add Todo
              </Button>
            </Box>

            <Divider style={{ margin: 10 }} />
            <AddEventModal
              open={openSlot}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              todos={todos}
            />
            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
            />
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => setEventInfoModal(false)}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent}
            />
            <AddTodoModal open={openTodoModal} handleClose={() => setOpenTodoModal(false)} todos={todos} setTodos={setTodos} />
            <AddEventReunion
              open={openReunionModal}
              handleClose={() => {
                setOpenReunionModal(false);
                setSelectedEventType(null);
              }}
              onAddEvent={(event) => {
                const newEvent = {
                  ...event,
                  _id: generateId(),
                  start: new Date(),
                  end: new Date(),
                  type: "reunion",
                };
                setEvents([...events, newEvent]);
                setOpenReunionModal(false);
                setSelectedEventType(null);
              }}
            />
            <AddEventVisite
              open={openVisiteModal}
              handleClose={() => {
                setOpenVisiteModal(false);
                setSelectedEventType(null);
              }}
              onAddEvent={(event) => {
                const newEvent = {
                  ...event,
                  _id: generateId(),
                  start: new Date(),
                  end: new Date(),
                  type: "visite",
                };
                setEvents([...events, newEvent]);
                setOpenVisiteModal(false);
                setSelectedEventType(null);
              }}
            />
            <AddEventTache
              open={openTacheModal}
              handleClose={() => {
                setOpenTacheModal(false);
                setSelectedEventType(null);
              }}
              onAddEvent={(event) => {
                const newEvent = {
                  ...event,
                  _id: generateId(),
                  start: new Date(),
                  end: new Date(),
                  type: "tache",
                };
                setEvents([...events, newEvent]);
                setOpenTacheModal(false);
                setSelectedEventType(null);
              }}
            />
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="start"
              components={{ event: EventInfo }}
              endAccessor="end"
              defaultView="week"
              eventPropGetter={(event) => {
                const hasTodo = todos.find((todo) => todo._id === event.todoId);
                return {
                  style: {
                    backgroundColor: hasTodo ? hasTodo.color : "#b64fc8",
                    borderColor: hasTodo ? hasTodo.color : "#b64fc8",
                  },
                };
              }}
              style={{ height: 900 }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EventCalendar;