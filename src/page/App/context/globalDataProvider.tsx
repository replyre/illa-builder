import { createContext, ReactNode, FC, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { NotificationType, Notification } from "@illa-design/notification"
import { isValidUrlScheme } from "@/utils/typeHelper"
import { getExecution } from "@/redux/currentApp/executionTree/execution/executionSelector"

interface Injected {
  globalData: { [key: string]: any }
  handleUpdateGlobalData: (key: string, value: any) => void
}

export const GLOBAL_DATA_CONTEXT = createContext<Injected>({} as Injected)

interface Props {
  children?: ReactNode
}

// {{showNotification("info","222","333")}}
const showNotification = (
  type: NotificationType,
  title: string,
  description: string,
  duration: number = 4500,
) => {
  Notification[type]({
    title,
    content: description,
    duration,
  })
}

const runScript = (script: string) => {
  try {
    // TODO: @WeiChen wait use parser
    const result = eval(script)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

// {{goToURL("https://www.baidu.com",true)}}
const goToURL = (url: string, isNewTab?: boolean) => {
  let finalURL = url
  if (!isValidUrlScheme(finalURL)) {
    finalURL = `https://${finalURL}`
  }
  if (isNewTab) {
    window.open(finalURL, "_blank")
  } else {
    window.location.assign(finalURL)
  }
}

const initState = {
  showNotification,
  runScript,
  goToURL,
}

export const GlobalDataProvider: FC<Props> = ({ children }) => {
  const displayNameMapProps = useSelector(getExecution)
  const [globalData, setGlobalData] = useState<Record<string, any>>({
    ...displayNameMapProps,
    ...initState,
  })

  useEffect(() => {
    setGlobalData({
      ...displayNameMapProps,
      ...initState,
    })
  }, [displayNameMapProps])

  const handleUpdateGlobalData = (key: string, value: any) => {
    setGlobalData({
      ...globalData,
      [key]: value,
    })
  }

  const value = {
    globalData: { ...globalData },
    handleUpdateGlobalData,
  }

  return (
    <GLOBAL_DATA_CONTEXT.Provider value={value}>
      {children}
    </GLOBAL_DATA_CONTEXT.Provider>
  )
}

GlobalDataProvider.displayName = "GlobalDataProvider"