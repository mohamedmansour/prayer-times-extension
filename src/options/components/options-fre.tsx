import { icon } from 'leaflet'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { browser } from 'webextension-polyfill-ts'
import { calculationMethods, PrayerTimeFormat } from '../../shared/pray_time'
import { localizedMessages } from '../../shared/pray_time_messages'
import { Setting } from '../../shared/settings'
import { useOptionsState } from '../state'

export const FirstRunExperience = observer(() => {
  const state = useOptionsState()

  if (!state.settings) {
    return <>Loading...</>
  }

  return (
    <>
      <h1>FRE</h1>

      <CurrentPosition />
      <CalculationMethod />
      <TimeFormat />
      <Timenames />
    </>
  )
})

const useCurrentPositionStyles = createUseStyles({
  map: {
    height: 200,
    width: 500
  },
})

interface CurrentPositionMarkerProps {
  lat: number
  lng: number
}

function CurrentPositionMarker(props: CurrentPositionMarkerProps) {
  const state = useOptionsState()
  const map = useMapEvents({
    mouseup: () => {
      const center = map.getCenter()
      state.updateSetting(Setting.currentPosition, {latitude: center.lat, longitude: center.lng })
    },
  })

  useEffect(() => {
    map.flyTo(props)
  }, [map, props])

  return (
    <Marker position={props} icon={icon({iconUrl: browser.runtime.getURL('/images/icons/icon.png'), iconSize: [64,64]})} />
  )
}

const CurrentPosition = observer(() => {
  const classes = useCurrentPositionStyles()
  const state = useOptionsState()
  const currentPosition = {
    lat: state.settings.currentPosition.latitude,
    lng: state.settings.currentPosition.longitude
  }

  return (
    <div>
      <h2>Location</h2>
      {currentPosition && (
        <div>
          <p>
            <strong>Latitude:</strong> {currentPosition.lat} &nbsp;
            <strong>Longitude:</strong> {currentPosition.lng}
            <button onClick={() => state.queryLocation()}>Refresh Location</button>
          </p>
          <div>
            <MapContainer center={currentPosition} zoom={20} className={classes.map}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
               <CurrentPositionMarker {...currentPosition} />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  )
})

const CalculationMethod = observer(() => {
  const state = useOptionsState()
  const calculation = state.settings.calculation
  return (
    <div>
      <h2>Calculation Method</h2>
      <select
        value={calculation}
        onChange={(e) => state.updateSetting(Setting.calculation, parseInt(e.target.value))}
      >
        {Object.keys(calculationMethods).map((method) => (
          <option key={method} value={method}>
            {calculationMethods[method].name}
          </option>
        ))}
      </select>
    </div>
  )
})

const TimeFormat = observer(() => {
  const state = useOptionsState()
  const timeformat = state.settings.timeformat
  return (
    <div>
      <h2>Time Format</h2>
      <select
        value={timeformat}
        onChange={(e) => state.updateSetting(Setting.timeformat, parseInt(e.target.value))}
      >
        <option value={PrayerTimeFormat.TwelveHourFormat}>12 hours</option>
        <option value={PrayerTimeFormat.TwentyFourFormat}>24 hours</option>
      </select>
    </div>
  )
})

const Timenames = observer(() => {
  const state = useOptionsState()
  const timenames = state.settings.timenames

  if (!timenames) return null

  return (
    <div>
      <h2>Visible Times</h2>
      {Object.keys(localizedMessages).map((timename, idx) => (
        <span key={idx}>
          <input
            checked={timenames[timename]}
            name="timenames"
            onChange={(e) => state.updateTimename(timename, e.target.checked)}
            type="checkbox"
          />{' '}
          {localizedMessages[timename]}
        </span>
      ))}
    </div>
  )
})
