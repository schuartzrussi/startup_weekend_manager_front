import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Loading from '../../../components/loading';
import {getUsers} from '../../../services/api';


const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

export default function AdminUsersPage() {
	const classes = useStyles();

    const [loadingVisible, setLoadingVisible] = useState(false);
	const [users, setUsers] = useState([])

	const loadUsers = async () => {
		setLoadingVisible(true);
		const response = await getUsers();
		setLoadingVisible(false);
		if (response.status === 200) {
			if (response.data != undefined && response.data != null) {
				setUsers(response.data.items)
			}
		}
	}

	useEffect(() => {
		loadUsers();
	}, [])

    return (
        <div>
			<Loading
                visible={loadingVisible}
            />

			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Nome</TableCell>	
							<TableCell>Email</TableCell>	
							<TableCell>Telefone</TableCell>	
							<TableCell align="center">Votos</TableCell>	
							<TableCell>Tipo</TableCell>	
						</TableRow>
					</TableHead>

					<TableBody>
						{users.map((item) => (
							<TableRow key={item.oid}>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.email}</TableCell>
								<TableCell>{item.cellphone}</TableCell>
								<TableCell align="center">{item.available_votes}</TableCell>
								<TableCell>{item.type}</TableCell>
							</TableRow>
						))}		
					</TableBody>
				</Table>
			</TableContainer>
        </div>
    )
}
