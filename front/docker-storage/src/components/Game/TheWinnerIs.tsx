

export function TheWinnerIs({ won }: { won:boolean }){
    if (won)
      return (<h4>YOU WON!!</h4>);
    return (<h4>YOU LOSE!!</h4>);
  }
