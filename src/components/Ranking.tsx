


export function RankingHeader({ dataKeys }: { dataKeys: Array<string>}) {
  return (
    <div style={{ display: "flex", flexDirection: "row", fontSize: "1em", paddingLeft: "1em", paddingRight: "1em", paddingTop: "0.5em", paddingBottom: "0.5em" }}>
      <div style={{ width: "2em" }}>

      </div>
      <div>

      </div>
      <div style={{ flexGrow: 1 }}>
        User
      </div>

      {dataKeys.map(key => (
        <div key={key} style={{ width: "5em", textAlign: "right"}}>
          {key}
        </div>
      ))}
    </div>
  );
}

export function RankingEntry({ rank, displayName, data }: { rank: number; displayName: string; data: Array<{key: string, val: string}>}) {

  return (
    <div style={{ display: "flex", flexDirection: "row", fontSize: "1em", paddingLeft: "1em", paddingRight: "1em", paddingTop: "0.5em", paddingBottom: "0.5em" }}>
      <div style={{ width: "2em" }}>
        {rank}
      </div>
      <div>

      </div>
      <div style={{ flexGrow: 1 }}>
        {displayName}
      </div>

      {data.map(entry => (
        <div key={entry.key} style={{ width: "5em", textAlign: "right" }}>
          {entry.val}
        </div>
      ))}
    </div>
  );
}


export function SimplifiedRankingEntry({ rank, displayName, score }: { rank: number; displayName: string; score: string; }) {
  return (
    <RankingEntry rank={rank} displayName={displayName} data={[{key: "score", val: score}]}/>
  );
}
