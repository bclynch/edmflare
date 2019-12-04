create function edm.search_events_by_city(query text, cityId integer) returns setof edm.event as $$
  select event.*
  from edm.event as event
  where event.city = cityId
  and (
    event.name ilike ('%' || query || '%')
    or event.venue ilike ('%' || query || '%')
  )
  ORDER BY event.start_date ASC
$$ language sql stable;

comment on function edm.search_events_by_city(text, integer) is 'Returns events by city containing a given query term.';
