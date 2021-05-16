import { icon } from 'leaflet'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { browser } from 'webextension-polyfill-ts'
import { Setting } from '../../shared/settings'
import { useOptionsState } from '../state'
import useStyles from './option-current-position.styles'

export const OptionCurrentPosition = observer(() => {
  const classes = useStyles()
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

interface CurrentPositionMarkerProps {
  lat: number
  lng: number
}

function CurrentPositionMarker(props: CurrentPositionMarkerProps) {
  const state = useOptionsState()
  const map = useMapEvents({
    mouseup: () => {
      const center = map.getCenter()
      state.updateSetting(Setting.currentPosition, {latitude: center.lat.toFixed(4), longitude: center.lng.toFixed(4) })
    },
  })

  useEffect(() => {
    map.flyTo(props)
  }, [map, props])

  return (
    <Marker position={props} icon={icon({iconUrl: browser.runtime.getURL('/images/icons/icon.png'), iconSize: [64,64]})} />
  )
}
