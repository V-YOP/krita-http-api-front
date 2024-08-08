import { useEffect, useRef } from "react"

function Interactable({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }): JSX.Element {
  const ref = useRef(null as unknown as HTMLDivElement)

  useEffect(() => {
    // TODO 如果有性能问题，节流，或者维护当前状态
    const onMouseEnter = (e?: MouseEvent): void => {
      window.api.setIgnoreMouseEvents(false, { forward: true })
      if (e) {
        e.stopPropagation()
      }
    }
    const onMouseLeave = (e?: MouseEvent): void => {
      window.api.setIgnoreMouseEvents(true, { forward: true })
      if (e) {
        e.stopPropagation()
      }
    }
    
    const elem = ref.current
    elem.addEventListener('mouseenter', onMouseEnter)
    elem.addEventListener('mousemove', onMouseEnter)
    elem.addEventListener('mouseleave', onMouseLeave)
    onMouseLeave()
    return () => {
      elem.removeEventListener('mouseenter', onMouseEnter)
      elem.removeEventListener('mousemove', onMouseEnter)
      elem.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div ref={ref} style={{ position: 'absolute', width: 'fit-content', height: 'fit-content', border: 0, padding: 0, margin: 0, display: 'block', ...style }}>{children}</div>
  )
}


export default Interactable





// keepalive master down. master2 up

/*

0.00 inserts/s, 0.00 updates/s, 0.00 deletes/s, 0.00 reads/s
----------------------------
END OF INNODB MONITOR OUTPUT
============================
2024-07-25T12:52:05.411558Z 10624 [ERROR] [MY-011957] [InnoDB] [FATAL] Over 95 percent of the buffer pool is occupied by lock heaps or the adaptive hash index! Check that your transactions do not set too many row locks. Your buffer pool size is 127 MB. Maybe you should make the buffer pool bigger? We intentionally generate a seg fault to print a stack trace on Linux!
2024-07-25T12:52:05.429738Z 10624 [ERROR] [MY-013183] [InnoDB] Assertion failure: buf0lru.cc:1264:ib::fatal triggered thread 126861602342464
InnoDB: We intentionally generate a memory trap.
InnoDB: Submit a detailed bug report to http://bugs.mysql.com.
InnoDB: If you get repeated assertion failures or crashes, even
InnoDB: immediately after the mysqld startup, there may be
InnoDB: corruption in the InnoDB tablespace. Please refer to
InnoDB: http://dev.mysql.com/doc/refman/8.0/en/forcing-innodb-recovery.html
InnoDB: about forcing recovery.
2024-07-25T12:52:05Z UTC - mysqld got signal 6 ;
Most likely, you have hit a bug, but this error can also be caused by malfunctioning hardware.
BuildID[sha1]=773726723fa9c27f49de3c5134e0c9f687afbc56
Server Version: 8.0.36-28.1 Percona XtraDB Cluster (GPL), Release rel28, Revision bfb687f, WSREP version 26.1.4.3, wsrep_26.1.4.3

Thread pointer: 0x73616c1a9690
Attempting backtrace. You can use the following information to find out
where mysqld died. If you see no messages after this, something went
terribly wrong...
stack_bottom = 736144be3b70 thread_stack 0x100000
/usr/sbin/mysqld(my_print_stacktrace(unsigned char const*, unsigned long)+0x41) [0x590354397391]
/usr/sbin/mysqld(print_fatal_signal(int)+0x39f) [0x59035
*/