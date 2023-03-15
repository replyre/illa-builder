import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useMessage } from "@illa-design/react"
import { forkTemplateApp } from "@/api/actions"
import { ReactComponent as ForkIcon } from "@/assets/tutorial/fork.svg"
import { TemplateName } from "@/config/template/interface"
import { TemplateListProps } from "@/page/Dashboard/Tutorial/TemplateList/interface"
import {
  contentStyle,
  descStyle,
  forkIconStyle,
  forkItemStyle,
  iconStyle,
  itemStyle,
  templateStyle,
  titleStyle,
} from "@/page/Dashboard/Tutorial/TemplateList/style"

export const TemplateList: FC<TemplateListProps> = (props) => {
  const { data, loading, setLoading } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { teamIdentifier } = useParams()
  const message = useMessage()

  const handleForkApp = async (templateName: string) => {
    if (loading) return
    setLoading(true)
    try {
      const appId = await forkTemplateApp(templateName as TemplateName)
      navigate(`/${teamIdentifier}/app/${appId}`)
    } catch (e: any) {
      if (e?.response?.data?.errorMessage) {
        message.error({
          content: e?.response?.data?.errorMessage,
        })
      }
      if (e?.response == undefined && e?.request != undefined) {
        message.warning({
          content: t("network_error"),
        })
      }
    }
    setLoading(false)
  }

  return (
    <div css={templateStyle}>
      {data.map((item) => {
        return (
          <div
            key={item.type}
            css={itemStyle}
            onClick={() => {
              navigate(`/${teamIdentifier}/template/${item.type}`)
            }}
          >
            <img css={iconStyle} src={item.icon} />
            <div css={contentStyle}>
              <div css={titleStyle}>{item.name}</div>
              <div css={descStyle}>{item.desc}</div>
            </div>
            <div
              css={forkItemStyle}
              onClick={async (e) => {
                e.stopPropagation()
                handleForkApp(item.type)
              }}
            >
              <ForkIcon css={forkIconStyle} />
              {t("editor.tutorial.panel.tutorial.templates_action.fork")}
            </div>
          </div>
        )
      })}
    </div>
  )
}

TemplateList.displayName = "TemplateList"