function getRemarks(allData) {
  if (!allData) return "";

  try {
    const parsed = typeof allData === "string" ? JSON.parse(allData) : allData;
    return parsed.OpenHouseRemarks || "";
  } catch (error) {
    return "";
  }
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
    new Date(value)
  );
}

function formatTime(value) {
  if (!value) return "Time unavailable";
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hours, minutes));
}

function OpenHouseList({ openHouses }) {
  return (
    <section className="open-houses">
      <h2>Open Houses</h2>
      {openHouses.length === 0 ? (
        <p>No open houses scheduled</p>
      ) : (
        <div className="open-houses__list">
          {openHouses.map((openHouse) => {
            const remarks = getRemarks(openHouse.all_data);
            return (
              <article key={openHouse.id || `${openHouse.OpenHouseDate}-${openHouse.OH_StartTime}`}>
                <h3>{formatDate(openHouse.OpenHouseDate)}</h3>
                <p>{formatTime(openHouse.OH_StartTime)} - {formatTime(openHouse.OH_EndTime)}</p>
                {remarks && <p>{remarks}</p>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OpenHouseList;
