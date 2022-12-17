import { signIn, getCsrfToken, getProviders } from 'next-auth/react'
import styles from '../../styles/Signin.module.css'

const Signin = ({ csrfToken, providers }) => {
    return (
        <div style={{ overflow: 'hidden', position: 'relative' }}>
            <div className={styles.wrapper} />
            <div className={styles.content}>
                <div className={styles.cardWrapper}>
                    <div className={styles.cardContent}>
                        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
                        <input placeholder='Email (Not Setup - Please Use Github)' size='large' />
                        <button className={styles.primaryBtn}>
                            Submit
                        </button>
                        <hr />
                        {providers &&
                            Object.values(providers).map(provider => (
                                <div key={provider.name} style={{ marginBottom: 0 }}>
                                    <button onClick={() => signIn(provider.id)} >
                                        Sign in with{' '} {provider.name}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin

export async function getServerSideProps(context) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            providers,
            csrfToken
        },
    }
}