import React from 'react'

const PlayerCard = ({player, isDrawing, correct}) => {
    const statusClass = () => {
        if (isDrawing) return "bg-slate-400 border-blue-400"
        if (correct) return "bg-green-400 border-green-600"
        return "border-black "
    }
  return (
    <div className= {`flex flex-col items-center justify-center ${statusClass()}`} >
        <div>{player.name}</div>
        <div>{player.points}pts</div>
    </div>
  )
}

export default PlayerCard