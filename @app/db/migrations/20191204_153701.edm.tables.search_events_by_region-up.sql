create function edm.search_events_by_region(query text, region_name text) returns setof edm.event as $$
  select event.*
  from edm.event as event
  where event.region = region_name
  and (
    event.name ilike ('%' || query || '%')
    or event.venue ilike ('%' || query || '%')
  )
  ORDER BY event.start_date ASC;
$$ language sql stable;

comment on function edm.search_events_by_region(text, text) is 'Returns events by region containing a given query term.';
