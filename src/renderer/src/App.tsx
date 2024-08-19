
import { useEffect } from 'react'
import { useColorMode } from '@chakra-ui/react'
import TopBar from '@renderer/containers/TopBar'
import TopStatusBar from '@renderer/containers/TopStatusBar'


function App(): JSX.Element {

  const {setColorMode} = useColorMode()
  useEffect(() => {
    setColorMode('dark')
  }, [setColorMode])
  return (
    <>
      <TopStatusBar></TopStatusBar>
      <TopBar></TopBar>
    </>
  )
}

// function PinButton() {
//   const getViewList = useKritaApi('view/list')
//   const [viewState, setViewState] = useState<ViewState | null>(null)
//   useEffect(() => {
//     let stopMe = false
//     ;((async () => {
//       while (true) {
//         if (stopMe) {
//           return
//         }
//         await sleep(33)
//         const newState = await getViewList('')
//         if (!newState.ok) {
//           continue
//         }
//         if (newState.data[0]) {
//           setViewState(newState.data[0])
//         }
//       }
//     })())

//     return () => {
//       stopMe = true
//     }
//   }, [getViewList])

//   const transformMatrix = useMemo(() => {
//     if (!viewState) {
//       return undefined
//     }
//     return matrixToCssTransform(viewState.canvasToImageMetrix)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [JSON.stringify(viewState?.canvasToImageMetrix)])
  
//   const width = fromKritaCoord(viewState?.viewClientSize[0] ?? 0, 1.25, 1)
//   const height = fromKritaCoord(viewState?.viewClientSize[1] ?? 0, 1.25, 1)
//   const top = fromKritaCoord(viewState?.areaPos[1] ?? 0, 1.25, 1) + fromKritaCoord(viewState?.viewClientPos[1] ?? 0, 1.25, 1)
//   const left = fromKritaCoord(viewState?.areaPos[0] ?? 0, 1.25, 1) + fromKritaCoord(viewState?.viewClientPos[0] ?? 0, 1.25, 1)

//   return createPortal(
//     <>
//       {/* <div style={{position: 'absolute',width, height,  top, left, maxWidth: '100%', maxHeight: '100%'}}>
//         <div style={{position: 'absolute', width: '100px', height: '100px', transform: transformMatrix, background: 'rgba(0,0,0,50%)'}}></div>
//       </div> */}
//     </>, document.body)
// }

// /**
//  * 计算 3x3 矩阵的逆矩阵。
//  *
//  * @param matrix 3x3 变换矩阵
//  * @returns 逆矩阵
//  */
// function invertMatrix(matrix: number[]): number[][] {
//   const [a, b, c, d, e, f, g, h, i] = matrix;

//   const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

//   if (det === 0) {
//       throw new Error('矩阵不可逆');
//   }
//   // return [
//   //   [a,b,c],
//   //   [d,e,f],
//   //   [g,h,i]
//   // ]
//   return [
//       [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det],
//       [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
//       [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det]
//   ];
// }

// /**
// * 将图像坐标到页面坐标的变换矩阵转换为 CSS `transform` 属性。
// *
// * @param matrix 3x3 变换矩阵（页面到图像）
// * @returns CSS `transform` 属性值
// */
// function matrixToCssTransform(matrix: number[]): string {
//   // 计算逆矩阵（图像到页面）
//   const invertedMatrix = invertMatrix(matrix);

//   // 提取逆矩阵的元素
//   const a = invertedMatrix[0][0];
//   const b = invertedMatrix[0][1];
//   const c = invertedMatrix[0][2];
//   const d = invertedMatrix[1][0];
//   const e = invertedMatrix[1][1];
//   const f = invertedMatrix[1][2];

//   // 计算 CSS `transform` 属性值
//   return `matrix(${a}, ${b}, ${d}, ${e}, ${c}, ${f})`;
// }

export default App
