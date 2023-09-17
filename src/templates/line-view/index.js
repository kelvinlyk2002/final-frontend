// library components
import PropTypes from "prop-types";

// theme components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "components/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";

// layout components
import Table from "components/Table";

function LineView({tableTitle, columns, rows}) {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
      <Card>
            {tableTitle && (
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">{tableTitle}</SoftTypography>
              </SoftBox>
            )}
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} />
            </SoftBox>
          </Card>
      </SoftBox>
    </DashboardLayout>
  );
}

LineView.propTypes = {
  tableTitle: PropTypes.string,
  columns: PropTypes.array,
  rows: PropTypes.array,
};

export default LineView;
