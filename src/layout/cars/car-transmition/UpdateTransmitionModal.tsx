import React, { useContext, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ButtonStyle, Color, Fonts } from "../../../assets/theme/theme";
import { style } from "../../../pages/cars/Cars";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { Option } from "../../../common/model";
import { showError, showSuccess } from "../../../components/alert/Alert";
import { AxiosInstance } from "../../../api/AxiosInstance";
import { AppContext } from "../../../App";

interface IProps {
  getData(): void;
  item: Option;
}

const UpdateTransmitionModal: React.FC<IProps> = (props: IProps) => {
  const { t, status } = useContext(AppContext);
  const [name_tm, setName_tm] = useState(props.item.name_tm);
  const [name_ru, setName_ru] = useState(props.item.name_ru);
  const [description, setDescription] = useState(props.item.description);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setName_tm(props.item.name_tm);
    setName_ru(props.item.name_ru);
    setDescription(props.item.description);
    setStatusValue(props.item.status);
  };
  const handleClose = () => setOpen(false);
  const [statusValue, setStatusValue] = useState(props.item.status);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      updateData();
    }
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatusValue(event.target.value as string);
  };

  function updateData() {
    const body = {
      name_tm: name_tm,
      name_ru: name_ru,
      description: description,
      status: statusValue,
    };
    AxiosInstance.patch(`/car-transmition/update/${props.item.id}`, body)
      .then((response) => {
        if (!response.data.error) {
          showSuccess("Car Option Successfully Updated!");
          handleClose();
          props.getData();
          setLoading(false);
        } else {
          showError("Car Option Update Error");
        }
      })
      .catch((error) => {
        showError(error + "");
      });
  }

  const clearInput = () => {
    setStatusValue("");
    setName_tm("");
    setName_ru("");
    setDescription("");
  };

  return (
    <>
      <div>
        <Tooltip title={t("edit")}>
          <IconButton onClick={handleOpen} sx={{ color: Color.primary }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Stack
                direction="row"
                alignItems={"center"}
                pb={1}
                justifyContent={"space-between"}
              >
                <Typography
                  sx={{ fontFamily: Fonts.OpenSansBold, fontSize: "18px" }}
                >
                  {t("editCarTransmition")}
                </Typography>
                <IconButton onClick={handleClose}>
                  <ClearIcon />
                </IconButton>
              </Stack>
              <Divider />
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                pt={5}
              >
                <Grid item xs={2} sm={7} md={6}>
                  <TextField
                    id="outlined-basic"
                    label={t("nameTm")}
                    variant="outlined"
                    fullWidth
                    value={name_tm}
                    onChange={(e) => setName_tm(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2} sm={7} md={6}>
                  <TextField
                    id="outlined-basic"
                    label={t("nameRu")}
                    variant="outlined"
                    fullWidth
                    value={name_ru}
                    onChange={(e) => setName_ru(e.target.value)}
                  />
                </Grid>

                <Grid item xs={2} sm={7} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {t("status")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={statusValue}
                      label={t("status")}
                      onChange={handleChangeStatus}
                    >
                      {status?.itemStatus
                        ? status?.itemStatus.map((item, i) => {
                            return (
                              <MenuItem
                                value={item}
                                key={`get_item_status_key+${i}`}
                              >
                                {item}
                              </MenuItem>
                            );
                          })
                        : null}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2} sm={7} md={6}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label={t("desc")}
                    multiline
                    fullWidth
                    maxRows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Stack
                direction={"row"}
                justifyContent="flex-end"
                spacing={2}
                mt={3}
              >
                <Button
                  sx={ButtonStyle}
                  startIcon={<ClearIcon />}
                  variant="contained"
                  onClick={clearInput}
                >
                  {t("clear")}
                </Button>

                <Box sx={{ m: 1, position: "relative" }}>
                  <Button
                    variant="contained"
                    sx={ButtonStyle}
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    onClick={handleButtonClick}
                  >
                    {t("save")}
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: Color.primary,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

export default UpdateTransmitionModal;
