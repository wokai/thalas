## Analysis of database content

library(RMySQL)

prdir <- "~/projects/node/thalas"
setwd(prdir)



con <- dbConnect(MySQL(), user='thalasroot', password='g3Rsa879:n4sqPkxz', dbname='thalas', host='localhost')


inhal <- dbReadTable(con, "mbVentInhal")
inhal$time <- strptime(inhal$time, "%Y-%m-%d %H:%M:%S")

table(inhal$episodeId)

epi <- inhal[inhal$episodeId==31, ]
epi$diff <- as.numeric(difftime(epi$time, epi$time[1], unit="mins"))
plot(cons~diff, epi, las=1, bty="n")



