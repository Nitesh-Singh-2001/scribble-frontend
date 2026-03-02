import React from 'react'
import PlayerCard from './PlayerCard'

const PlayerList = ({players}) => {
  return (
    <div className='space-y-3'>
        <h3 className="font-bold text-gray-400 uppercase text-xs mb-4">Players</h3>
        {players.map((p) => (
            <PlayerCard key={p.id} player={p} />
        ))}
    </div>
  )
}

export default PlayerList