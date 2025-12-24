const checkIsNotEmpty = <T extends object>(obj: T | {} | null | undefined): obj is T => {
  return obj !== null && obj !== undefined && Object.keys(obj).length !== 0
}

export default checkIsNotEmpty
